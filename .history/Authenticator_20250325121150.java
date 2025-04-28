import java.util.*;
import java.io.*;

/* READ ME:
 * TO RUN THIS PROGRAM, COMPILE (javac Authenticator.java), 
 * THEN FOR:
 *      1) CREATING AN ACCOUNT, TYPE: java Authenticator "create"
 *      2) LOGGING IN TO AN EXISTING ACCOUNT, TYPE: java Authenticator "login"
 */

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
        
        // Store account information in a file
        try {
            File userFile = new File("users.txt");
            FileWriter fw = new FileWriter(userFile, true);
            fw.write(username + "," + password + "," + forename + "," + 
                    surname + "," + email + "," + dob + "\n");
            fw.close();
            System.out.println("Account created successfully!");
        } catch (IOException e) {
            System.out.println("Error: Could not save account information!");
            System.out.println("\t[Authenticator Error {createAccount}]");
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
        
        // Check credentials against stored accounts
        try {
            File userFile = new File("users.txt");
            Scanner fileScanner = new Scanner(userFile);
            
            while (fileScanner.hasNextLine()) {
                String line = fileScanner.nextLine();
                String[] userData = line.split(",");
                
                if (userData.length >= 2 && 
                    userData[0].equals(username) && 
                    userData[1].equals(password)) {
                    loginSuccess = true;
                    break;
                }
            }
            
            fileScanner.close();
            
            if (loginSuccess) {
                System.out.println("Login successful! Welcome back, " + username + ".");
            } else {
                System.out.println("Invalid username or password. Please try again.");
            }
            
        } catch (FileNotFoundException e) {
            System.out.println("Error: No user accounts found!");
            System.out.println("\t[Authenticator Error {login}]");
        }
    }

    public static void main(String[] args) {
        // "create" for creating an account, "login" for logging in to an account.
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