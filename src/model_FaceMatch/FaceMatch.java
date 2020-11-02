package model_FaceMatch;

import java.util.ArrayList;
import java.util.Iterator;

import org.json.JSONObject;

import com.baidu.aip.face.AipFace;
import com.baidu.aip.face.MatchRequest;

public class FaceMatch {
    //设置APPID/AK/SK
    public static final String APP_ID = "19327270";
    public static final String API_KEY = "XKE0pkEr0lRxbWWK12gDihM5";
    public static final String SECRET_KEY = "1V59TxupO0bvWFBmuGo9jXxRIbaNROzU";
    static AipFace client = null;

    static {
        //初始化一个AipFace
        client = new AipFace(APP_ID, API_KEY, SECRET_KEY);
        // 可选：设置网络连接参数
        // 连接超时
        client.setConnectionTimeoutInMillis(2000);
        // 连接后等待响应超时
        client.setSocketTimeoutInMillis(60000);
    }

    //imgStr1为传过来的用户将此次截图转换成的base64编码图片
    //imgStr2为数据库中查找到的base64编码的图片
    public double matchFace(String imgStr1, String imgStr2) {
        boolean flag = false;
        MatchRequest req1 = new MatchRequest(imgStr1, "BASE64");
        MatchRequest req2 = new MatchRequest(imgStr2, "BASE64");
        ArrayList<MatchRequest> requests = new ArrayList<MatchRequest>();
        requests.add(req1);
        requests.add(req2);
        //调用了百度人脸识别方法中的人脸对比方法比对两张图片中人脸的相似度，并返回相似度分值
        JSONObject res = client.match(requests);

        JSONObject results = res.getJSONObject("result");

        double resultscore = results.getDouble("score");

        return resultscore;

    }

}

