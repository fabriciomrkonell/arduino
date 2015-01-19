#include <SPI.h>
#include <Ethernet.h>
#include <Keypad.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192,168,0,50);
EthernetClient client;
char server[] = "schroeder-arduino.herokuapp.com/";
unsigned long lastConnectionTime = 0;
boolean lastConnected = false;
const unsigned long postingInterval = 6000;

const String tokenArduino = "FxQqo";


//Teclado
const byte numRows=4;
const byte numCols=4;
char keymap[numRows][numCols]= {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'},
};
byte rowPins[numRows] = {9,8,7,6};
byte colPins[numCols] = {5,4,3,2};
Keypad myKeypad = Keypad(makeKeymap(keymap), rowPins, colPins, numRows, numCols);


int passou = 0;
String retorno = "";
String password = "";

//Posiçao dos sensores
const int idBuzzer = 0;

//Serial
const int Buzzer = A1;

void setup() {
  Serial.begin(9600);
  Ethernet.begin(mac, ip);
}
void loop() {
  char keypressed = myKeypad.getKey();
  if(keypressed !=  NO_KEY){
   if(keypressed == 'C'){
     password = "";
   }else if(keypressed == 'D'){
     abrirPorta(password);         
     password = "";
   }else{
     password = password + String(keypressed);
    }
  }
  if (client.available()) {
    char c = client.read();
    if(c == '>'){
      passou = 0;
    }
    if(passou == 1){
      retorno = retorno + c;
    } 
    if(c == '<'){
      passou = 1;
    }
  }
  if (!client.connected() && lastConnected) { 
    if(retorno != ""){
      Serial.println(getValue(getValue(retorno, ';', idBuzzer), '-', 1));
      if(getValue(getValue(retorno, ';', idBuzzer), '-', 1) == "true;" || getValue(getValue(retorno, ';', idBuzzer), '-', 1) == "true"){
        tone(Buzzer,1500);
      }else{
        noTone(Buzzer);
      }
    }
    retorno = "";
    client.stop();
  }
  if(!client.connected() && (millis() - lastConnectionTime > postingInterval)) {
    httpRequest();
  }
  lastConnected = client.connected();
}

void httpRequest() {
  if (client.connect(server, 80)) {
    String url = "/schroeder/configuracoes/" + tokenArduino;
    client.println("GET " + url + " HTTP/1.0");
    client.println("Host: schroeder-arduino.herokuapp.com");
    client.println("Connection: close");
    client.println();
  }else {   
    client.stop();
  }
  lastConnectionTime = millis();
}

void abrirPorta(String senha) {
  if (client.connect(server, 80)) {
    String url = "/schroeder/autenticar/" + senha;
    client.println("GET " + url + " HTTP/1.0");
    client.println("Host: schroeder-arduino.herokuapp.com");
    client.println("Connection: close");
    client.println();
  }else {   
    client.stop();
  }
  lastConnectionTime = millis();
}

String getValue(String data, char separator, int index){
  int found = 0;
  int strIndex[] = {
  0, -1  };
  int maxIndex = data.length()-1;
  for(int i=0; i<=maxIndex && found<=index; i++){
  if(data.charAt(i)==separator || i==maxIndex){
  found++;
  strIndex[0] = strIndex[1]+1;
  strIndex[1] = (i == maxIndex) ? i+1 : i;
  }
 }
  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}
