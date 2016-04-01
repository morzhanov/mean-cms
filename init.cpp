#include <iostream>
using namespace std;

bool error()
{
        str::string result;

        std::string prompt = "if there some errors type \'exit'\";

        std::string exit = "exit";

        std::cout<<prompt;

        cin>>result;

        if(result == exit)
            return true;
        else
            return false;
}

int main() {

    std::cout<<"MEAN default app initialization! Press enter to start";

    system("npm init");

    if(error)
        return 1;

    system("npm i express mongoose bcrypt-nodejs jsonwebtoken morgan body-parser --save");

    if(error)
            return 1;

    std::cout<<"SetUp MongoDB on MODULUS and in config.js file and press enter";

    if(error)
            return 1;

        system("bower init");

    if(error)
            return 1;

        system("bower install bootstrap animate.css angular angular-route angular-animate --save");

    if(error)
        return 1;

    system("npm i gulp gulp-clean-css gulp-sass gulp-rename gulp-uglify gulp-concat gulp-nodemon --save-dev");


    std::cout<<"Setup gulp file and full application. Than run \"gulp\" in cmd";

    return 0;
}