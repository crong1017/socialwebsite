import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {

    public static void main(String[] args) throws IOException {
        // 創建一個 HTTP 伺服器，監聽 8080 埠號
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // 設置根路徑的處理器，回應 "Server is running"
        server.createContext("/", exchange -> {
            String response = "Server is running";
            exchange.sendResponseHeaders(200, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        });

        // 設置 "/api/posts" 路徑，處理貼文相關請求
        server.createContext("/api/posts", exchange -> {
            if ("GET".equals(exchange.getRequestMethod())) {
                // 回應所有貼文（這裡假設貼文列表為靜態字串）
                String jsonResponse = "[{\"id\":1,\"content\":\"Hello World\"}, {\"id\":2,\"content\":\"Java HTTP Server\"}]";
                exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(jsonResponse.getBytes());
                }
            } else {
                // 其他請求方法回應 405 Method Not Allowed
                exchange.sendResponseHeaders(405, -1);
            }
        });

        // 啟動伺服器
        server.setExecutor(null); // 預設的 executor
        server.start();
        System.out.println("Server is running on port 8080");
    }
}
