/* Aura */
import java.util.*;

/* READ ME:
 * TO RUN THIS PROGRAM, COMPILE (javac Authenticator.java), 
 * THEN FOR:
 *      1) CREATING AN ACCOUNT, TYPE: java Authenticator "create"
 *      2) LOGGING IN TO AN EXISTING ACCOUNT, TYPE: java Authenticator "login"
 */

public class Authenticator{

    void createAccount(){
        String forename, surname, email, dob, username, password;
        System.out.println("Entered createAccount()"); //Just for testing. REMOVE!!
    }

    void login(){
        String username, password;
        System.out.println("Entered login()"); //Just for testing. REMOVE!!
    }

    public static void main(String[] args) {
        // "create" for creating an account, "login" for logging in to an account.
        if(args.length == 1){
            Authenticator ob = new Authenticator();

            if(args[0].equals("create"))
            ob.createAccount();

            else if(args[0].equals("login"))
            ob.login();

            else{
                System.out.println("Error:  Invalid Option!");
                System.out.println("\t[Authenticator Error {main}]");
            }
        }
        else{
            System.out.println("Error:  No option was selected!");
            System.out.println("\t[Authenticator Error {main}]");
        }
    }
}