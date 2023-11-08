//"use strict";

//Inicializa la pantalla de la calculadora
math.config({
  	number: 'BigNumber',      // Default type of number:
                            // 'number' (default), 'BigNumber', or 'Fraction'
  	precision: 509,            // Number of significant digits for BigNumbers
  	epsilon: 1e-128
})

function initialize()
{
	document.getElementById("pantallita").value = null;
}

function limit(num)
{
	let n = math.bignumber(num); 
	let x = math.abs(n);

	if(math.compare(x, '1e+508') == 1 || math.compare(x, '1e+508') == 0)
		n = "Infinity";
	else if(math.compare(x, '1e-508') == -1)
		n = 0;

	return n;
}

//Cambia el color del fondo al presionar el boton
function changeBackground()
{ 
	//colores del fondo
	let tema_oscuro = "#0B3B0B";
	let tema_claro = "#E6E6E6";
	//colores de los textos
	let texto_oscuro = "black";
	let texto_claro = "white"

	let color = window.getComputedStyle(document.documentElement).getPropertyValue("--fondo_pantalla");
	console.log(color)

	if(color == tema_oscuro){
		document.documentElement.style.setProperty("--fondo_pantalla", tema_claro);
		document.documentElement.style.setProperty("--color_textos", texto_oscuro);
	}
	else{
		document.documentElement.style.setProperty("--fondo_pantalla", tema_oscuro);
		document.documentElement.style.setProperty("--color_textos", texto_claro);
	}
	
}

//Imprime el dato ingresado con los botones
function print(dato)
{
/*	if(!isNaN(dato) || dato=="+" || dato=="-" || dato=="X" || dato=="/" || dato=="." || dato=="e" || dato=="pi" || dato=="(" || dato==")")
		document.getElementById("pantallita").value += dato;	
	else if(dato=="!")
	{
		let exp = document.getElementById("pantallita").value;
		document.getElementById("pantallita").value = `fact(${exp})`;
	}
	else if(dato=="^")
		document.getElementById("pantallita").value += "^";
	else if(dato=="sin" || dato=="cos" || dato=="tan")
	{
		let exp = document.getElementById("pantallita").value;
		document.getElementById("pantallita").value = `${dato}(${exp})`;
	}
*/
	document.getElementById("pantallita").value += dato
}

//Limpia la pantalla
function clean()
{
	document.documentElement.style.setProperty("--color_placeholder", "black");
	document.getElementById("pantallita").placeholder = "0";
	document.getElementById("pantallita").value = null;
}

//Envia un mensaje de error a la pantalla
function sendError(name)
{
	if(name == "ReferenceError" || name == "TypeError")
		name = "SyntaxError";
	else if(name == "Error")
		name = "MathError";

	clean();
	document.documentElement.style.setProperty("--color_placeholder", "#DF0101");
	document.getElementById("pantallita").placeholder = name;
}

//Resuelve matemáticamente la expresión ingresada
function solve(exp)
{
	let scope = {}
	let exp_compiled = math.parse(exp).compile();
	let r = exp_compiled.evaluate(scope);
	return r;
}

//Procesa la expresión ingresada
function processExp()
{
	let resultado;
	let expresion; 
	let expresion_HTML = document.getElementById("pantallita").value;
	
	//reemplazamos los "X" que aparezcan por los "*" para que solve() lo tome bien
	expresion = expresion_HTML.replace(/x/g, "*");
	//reemplazamos en donde diga "fact" por "factorial" para que solve() lo tome bien
	expresion = expresion.replace(/fact/g, "factorial");
	console.log("ingresado: " + expresion);

	try{
		resultado = solve(expresion);
		console.log("resultado: " + resultado);
		resultado = limit(resultado);
		console.log("resultado limitado: " + resultado);
	}
	catch(error){
		sendError(error.name);
		console.log("Surgio un error: " + error.name);
	}

	if(resultado != undefined){
		if(resultado == "Infinity" || resultado == "-Infinity" || isNaN(resultado))
			sendError("MathError");
		else{
			document.getElementById("pantallita").value = resultado; //Aca se muestra el resultado en pantalla
		}
				
	}
}