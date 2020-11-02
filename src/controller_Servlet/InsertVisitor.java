package controller_Servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model_Db.DbUtil;
import org.json.JSONObject;

@WebServlet("/InsertVisitor")
public class InsertVisitor extends HttpServlet {


    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        req.setCharacterEncoding("utf-8");
        String id = req.getParameter("visitor_id");
        String name = req.getParameter("visitor_name");
        String reason = req.getParameter("visitor_reason");
        boolean resl = false;
        //reason = new String(reason.getBytes("iso-8859-1"),"UTF-8");
        String sql1 = "Insert into visitor(vid,vname,vreason)";
        String sql2 = "values('" + id + "','" + name + "','" + reason + "')";

        String sql = sql1 + sql2;
        DbUtil run = new DbUtil();
        int n = run.updateSQL(sql);
        if (n >= 1) {
            resl = true;

        } else {
            resl = false;

        }
        //返回json数据到前台
        JSONObject obj = new JSONObject();

        obj.put("resl", resl);
        PrintWriter writer = resp.getWriter();

        writer.print(obj);
        writer.close();
    }


    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        this.doGet(req, resp);
    }


}
