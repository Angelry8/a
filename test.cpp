#ifndef ESTUDIANTE_H
#define ESTUDIANTE_H

#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
#include <limits>
#include <cctype>

using namespace std;

// Estructura principal para almacenar datos del estudiante
struct Estudiante {
    string primerNombre;
    string primerApellido;
    string segundoApellido;
    int ciclo;
    int cedula;
    double calificaciones[5];
    double promedio;
    bool aprobado;
    
    // Constructor
    Estudiante();
};

// Declaraciones de funciones para validación de entrada
bool soloLetrasYEspacios(const string& texto);
string validarNombre(const string& mensaje);
int validarEnteroPositivo(const string& mensaje);
double validarCalificacion(const string& mensaje);

// Declaraciones de funciones para captura de datos
void capturarDatosEstudiante(Estudiante& estudiante, int numeroEstudiante);

// Declaraciones de funciones para reportes
void mostrarReporteAprobados(const vector<Estudiante>& estudiantes);
void mostrarReporteReprobados(const vector<Estudiante>& estudiantes);
void mostrarEstadisticas(const vector<Estudiante>& estudiantes);

// Declaraciones de funciones para interfaz
void mostrarEncabezado();
void mostrarEncabezadoEstudiante(int numeroEstudiante);

#endif