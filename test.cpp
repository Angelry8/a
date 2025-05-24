#include <iostream>
using namespace std;

double suma (double a, double b ){
    return a+b;
}
double resta (double c, double d ){
    return c-d;
}

int main() {

double a =0;
double b =0;
double c =0;
double d =0;
cout<< "Bienvenido, a sumar!!" <<endl;
cout<< "Ingrese el primer numero: " <<endl;
cin >> a;
cout<< "Ingrese el segundo numero: " <<endl;
cin >> b;
cout<< "La suma es: "<<double(suma(a,b)) <<endl;
cout<< "Bienvenido, a restar!!" <<endl;
cout<< "Ingrese el primer numero: " <<endl;
cin >> c;
cout<< "Ingrese el segundo numero: " <<endl;
cin >> d;
cout<< "La resta es: "<<double(resta(c,d)) <<endl;


return 0;

}