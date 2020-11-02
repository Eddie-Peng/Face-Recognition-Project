package model_Db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DBConnection {
    private static String driverName = "com.mysql.jdbc.Driver";
    private static String url = "jdbc:mysql://127.0.0.1:3306/building?characterEncoding=utf8&useSSL=false";
    private static String user = "root";
    private static String password = "root";
	
	public static Connection getDBconnection() {
		try{
		 	Class.forName(driverName);
		 	Connection con = DriverManager.getConnection(url,user, password);
		 	return con;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static void closeDB(Connection con, PreparedStatement pstm, ResultSet rs) {
		try{
			if(rs != null) {
				rs.close();
			}
			if(pstm != null) {
				pstm.close();
			}
			if(con != null) {
				con.close();
			}
		} catch(Exception e) {
			
		}
	}
}
