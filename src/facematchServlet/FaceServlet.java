package facematchServlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import model_Db.DbUtil;

import java.sql.*;

import model_FaceMatch.FaceMatch;

/**
 * Servlet implementation class FaceServlet
 */
@WebServlet("/FaceServlet")
public class FaceServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        //接收由客户端传送过来的base64编码的图片
        String base = request.getParameter("base");

        String sql = "select studentnum,base64 from facemessage";

        DbUtil run = new DbUtil();
        String base64 = "";
        String studentnum = "";
        FaceMatch face = new FaceMatch();

        //将所有人脸信息都放入结果集rs中
        ResultSet rs = run.QuerySQL(sql);
        double score = 0;
        boolean result = false;
        try {
            while (rs.next()) {
                studentnum = rs.getString("studentnum");
                base64 = rs.getString("base64");

                //将此次用户截图转换成的base64编码图片base
                //和在数据库中查找到的base64编码的图片通过matchFace方法进行一一比对
                score = face.matchFace(base, base64);

                //加假如匹配分数大于85，则退出查找
                if (score >= 85) {
                    result = true;
                    break;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        //返回json数据到前台
        JSONObject obj = new JSONObject();

        obj.put("result", result);

        obj.put("studentnum", studentnum);

        PrintWriter writer = response.getWriter();

        writer.print(obj);
        writer.flush();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

}
