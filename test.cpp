#include <iostream>
using namespace std;

double suma (double a, double b ){
    return a+b;
}


int main() {

double a =0;
double b =0;
cout<< "Bienvenido!!" <<endl;
cout<< "Ingrese el primer numero: " <<endl;
cin >> a;
cout<< "Ingrese el segundo numero: " <<endl;
cin >> b;
cout<< "La suma es: "<<double(suma(a,b)) <<endl;


return 0;

}