import java.util.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
/* READ ME:
 * TO RUN THIS PROGRAM, COMPILE (javac Authenticator.java), 
 * THEN FOR:
 *      1) CREATING AN ACCOUNT, TYPE: java Authenticator "create"
 *      2) LOGGING IN TO AN EXISTING ACCOUNT, TYPE: java Authenticator "login"
 */
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;



public class Authenticator {

    void createAccount() {
        String forename, surname, email, dob, username, password;
        Scanner sc = new Scanner(System.in);
        
        // Get user information
        System.out.println("=== Create a New Account ===");
        
        System.out.print("Enter forename: ");
        forename = sc.nextLine();
        
        System.out.print("Enter surname: ");
        surname = sc.nextLine();
        
        System.out.print("Enter email: ");
        email = sc.nextLine();
        
        System.out.print("Enter date of birth (DD/MM/YYYY): ");
        dob = sc.nextLine();
        
        System.out.print("Create username: ");
        username = sc.nextLine();
        
        System.out.print("Create password: ");
        password = sc.nextLine();


         String Accounturl = "http://ec2-54-89-77-213.compute-1.amazonaws.com:3000/AddUser";
         HttpClient Accountclient = HttpClient.newHttpClient();



        String Ajson = "{"
                + "\"forename\": \"" + forename + "\","
                + "\"surname\": \"" + surname + "\","
                + "\"email\": \"" + email + "\","
                + "\"dob\": \"" + dob + "\","
                + "\"username\": \"" + username + "\","
                + "\"password\": \"" + password + "\""
                + "}";


        HttpRequest Accountrequest = HttpRequest.newBuilder()
                .uri(URI.create(Accounturl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(Ajson))
                .build();

        try {
            HttpResponse<String> Accountresponse = Accountclient.send(Accountrequest, HttpResponse.BodyHandlers.ofString());
            System.out.println("Account Creation Response: " + Accountresponse.body());
        } catch (IOException | InterruptedException e) {
            System.out.println("Error sending request to API.");
            e.printStackTrace();
        }

        

        
    
    }

    void login() {
        String username, password;
        Scanner sc = new Scanner(System.in);
        boolean loginSuccess = false;
        
        System.out.println("=== Login to Your Account ===");
        
        System.out.print("Enter username: ");
        username = sc.nextLine();
        
        System.out.print("Enter password: ");
        password = sc.nextLine();
        

       
        String Userurl = "http://ec2-54-89-77-213.compute-1.amazonaws.com:3000/Login";
        HttpClient Userclient = HttpClient.newHttpClient();

       String Ujson = "{"
       + "\"username\": \"" + username + "\","
       + "\"password\": \"" + password + "\""
       + "}";

       HttpRequest Userrequest = HttpRequest.newBuilder()
               .uri(URI.create(Userurl))
               .header("Content-Type", "application/json")
               .POST(HttpRequest.BodyPublishers.ofString(Ujson))
               .build();


       try {
           HttpResponse<String> Userresponse = Userclient.send(Userrequest, HttpResponse.BodyHandlers.ofString());
           System.out.println("Login response: " + Userresponse.body());
       } catch (IOException | InterruptedException e) {
           System.out.println("Error sending request to API.");
           e.printStackTrace();
       }

    }

    public static void main(String[] args) {

        if (args.length == 1) {
            Authenticator ob = new Authenticator();

            if (args[0].equals("create")) {
                ob.createAccount();
            } else if (args[0].equals("login")) {
                ob.login();
            } else {
                System.out.println("Error: Invalid Option!");
                System.out.println("\t[Authenticator Error {main}]");
            }
        } else {
            System.out.println("Error: No option was selected!");
            System.out.println("\t[Authenticator Error {main}]");
        }
    }
}