// Minimal webserver for static files.

// Copyright © 2002-2003 Anders Møller & Michael I. Schwartzbach
// Origin: https://cs.au.dk/~amoeller/WWW/javaweb/server.html
// No known licence.
// Minor modifications for Blockly.

// Compile with:  javac FileServer.java
// Run with: java FileServer 8001 ../
// Go to: http://localhost:8001/

import java.net.*;
import java.io.*;
import java.util.*;

public class FileServer {
  public static void main(String[] args) {
    // Read arguments.
    if (args.length != 2) {
      System.out.println("Usage: java FileServer <port> <wwwHome>");
      System.exit(-1);
    }
    int port = Integer.parseInt(args[0]);
    String wwwHome = args[1];

    // Open server socket.
    ServerSocket socket = null;
    try {
      socket = new ServerSocket(port);
    } catch (IOException e) {
      System.err.println("Could not start server: " + e);
      System.exit(-1);
    }
    System.out.println("FileServer accepting connections on port " + port);

    // Request handler loop.
    while (true) {
      Socket connection = null;
      try {
        // Wait for request.
        connection = socket.accept();
        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        OutputStream out = new BufferedOutputStream(connection.getOutputStream());
        PrintStream pout = new PrintStream(out);

        // Read first line of request (ignore the rest).
        String request = in.readLine();
        if (request == null) {
          continue;
        }
        log(connection, request);
        while (true) {
          String misc = in.readLine();
          if (misc == null || misc.length() == 0) break;
        }

        // Parse the line.
        if (!request.startsWith("GET") || request.length()<14 ||
          !(request.endsWith("HTTP/1.0") || request.endsWith("HTTP/1.1"))) {
          // bad request
          errorReport(pout, connection, "400", "Bad Request",
          "Your browser sent a request that " +
          "this server could not understand.");
        } else {
          String req = request.substring(4, request.length()-9).trim();
          if (req.indexOf("..")!=-1 ||
              req.indexOf("/.ht")!=-1 || req.endsWith("~")) {
            // Evil hacker trying to read non-wwwHome or secret file.
            errorReport(pout, connection, "403", "Forbidden",
                  "You don't have permission to access the requested URL.");
          } else {
            String path = wwwHome + "/" + req;
            File f = new File(path);
            if (f.isDirectory() && !path.endsWith("/")) {
              // Redirect browser if referring to directory without final '/'.
              pout.print("HTTP/1.0 301 Moved Permanently\r\n" +
                  "Location: http://" +
                  connection.getLocalAddress().getHostAddress() + ":" +
                  connection.getLocalPort() + "/" + req + "/\r\n\r\n");
              log(connection, "301 Moved Permanently");
            } else {
              if (f.isDirectory()) {
                // Yf directory, implicitly add 'index.html'.
                path = path + "index.html";
                f = new File(path);
              }
              try {
                // Send file.
                InputStream file = new FileInputStream(f);
                pout.print("HTTP/1.0 200 OK\r\n" +
                    "Content-Type: " + guessContentType(path) + "\r\n" +
                    "Date: " + new Date() + "\r\n" +
                    "Server: FileServer 1.0\r\n\r\n");
                sendFile(file, out); // send raw file
                log(connection, "200 OK");
              } catch (FileNotFoundException e) {
                // File not found.
                errorReport(pout, connection, "404", "Not Found",
                    "The requested URL was not found on this server.");
              }
            }
          }
        }
        out.flush();
      } catch (IOException e) {
        System.err.println(e);
      }
      try {
        if (connection != null) connection.close();
      } catch (IOException e) { System.err.println(e); }
    }
  }

  private static void log(Socket connection, String msg) {
    System.err.println(new Date() + " [" +
		    connection.getInetAddress().getHostAddress() + ":" +
				connection.getPort() + "] " + msg);
  }

  private static void errorReport(PrintStream pout, Socket connection,
      String code, String title, String msg) {
    pout.print("HTTP/1.0 " + code + " " + title + "\r\n" +
        "\r\n" +
        "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">\r\n" +
        "<TITLE>" + code + " " + title + "</TITLE>\r\n" +
        "</HEAD><BODY>\r\n" +
        "<H1>" + title + "</H1>\r\n" + msg + "<P>\r\n" +
        "<HR><ADDRESS>FileServer 1.0 at " +
        connection.getLocalAddress().getHostName() +
        " Port " + connection.getLocalPort() + "</ADDRESS>\r\n" +
        "</BODY></HTML>\r\n");
    log(connection, code + " " + title);
  }

  private static String guessContentType(String path) {
    if (path.endsWith(".html") || path.endsWith(".htm"))
      return "text/html";
    if (path.endsWith(".js") || path.endsWith(".mjs"))
      return "text/javascript";
    if (path.endsWith(".json"))
      return "application/json";
    if (path.endsWith(".gif"))
      return "image/gif";
    if (path.endsWith(".jpg") || path.endsWith(".jpeg"))
      return "image/jpeg";
    if (path.endsWith(".png"))
      return "image/png";
    if (path.endsWith(".svg"))
      return "image/svg+xml";
    return "text/plain";
  }

  private static void sendFile(InputStream file, OutputStream out) {
    try {
      byte[] buffer = new byte[1000];
      while (file.available() > 0) {
        out.write(buffer, 0, file.read(buffer));
      }
    } catch (IOException e) { System.err.println(e); }
  }
}
