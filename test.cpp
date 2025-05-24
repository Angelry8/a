#include <iostream>
using namespace std;

double suma (double a, double b ){
    return a+b;
}
double resta (double a, double b ){
    return a-b;
}
double multiplicacion (double a, double b ){
    return a*b;
}
double division (double a, double b ){
    return a/b;
}

int main() {

cout << "La suma de 2 y 2 es: " << suma(2,2) << endl;
cout << "La resta de 3 y 2 es: " << resta(3,2) << endl;
cout << "La multiplicacion de 3 y 2 es: " << multiplicacion(3,2) << endl;
cout << "La division de 4 y 2 es: " << division(4,2) << endl;

return 0;

}