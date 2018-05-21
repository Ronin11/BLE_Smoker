#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "CommandParser.h"

CommandList commandList = {NULL, 0};

void addCommandToCommandList(CommandList* commandList, Command command){
  commandList->length++;
  if(commandList->commands == NULL){
    commandList->commands = (Command*) malloc(sizeof(Command));
  }else{
    commandList->commands = (Command*) realloc(commandList->commands, sizeof(Command) * commandList->length);
  }
  commandList->commands[commandList->length - 1] = command; 
}


void addCommand(char commandString[], char* (*setFunc)(char* input), char* (*getFunc)()){
  Command command;
  command.commandString = commandString;
  command.setFunc = setFunc;
  command.getFunc = getFunc;
  addCommandToCommandList(&commandList, command);
}

char* parseCommand(char* commandString){
  const char delim = ':';
  char* preamble, value;
  preamble = commandString;
  for(int i = 0; commandString[i] != '\0'; i++){
    if(commandString[i] == delim){
      preamble[i] = '\0';
      value = *(commandString+i+1);
      break;
    }
  }
//  = strtok("TEMP:?", delim);
//  char* value = strtok(NULL, delim);
//  char* value2 = strtok(NULL, delim);

  Serial.println("\nPARSE COMMAND");
  Serial.println(commandString);
  Serial.println(preamble);
  Serial.println(value);

//  for(int i = 0; i < commandList.length; i++){
//    if(strcmp(preamble, commandList.commands[i].commandString) == 0){
//      if(strcmp(value, "?") == 0){
//        if(commandList.commands[i].getFunc != NULL)
//          return commandList.commands[i].getFunc();
//        else
//          return NULL;
//      }else{
//        if(commandList.commands[i].setFunc != NULL){
//          return commandList.commands[i].setFunc(value);
//        }else
//          return NULL;
//      }
//    }
//  }
//  return NULL;
}

/******* USAGE *********/

// char* printStuff(){
// 	return "Stuff";
// }

// char* setStuff(char *input){
// 	return input;
// }

// char* printStuff2(){
// 	return "Stuff2";
// }

// char* printStuff3(){
// 	return "Stuff3";
// }


// int main(){
// 	char command[] = "asdf:1234";
// 	char command2[] = "asdf2:?";
// 	char command3[] = "asdf3:?";
// 	addCommand("asdf", &setStuff, &printStuff);
// 	addCommand("asdf2", NULL, &printStuff2);
// 	addCommand("asdf3", NULL, &printStuff3);
// 	printf("RESULT: %s\n", parseCommand(command));
// 	printf("RESULT2: %s\n", parseCommand(command2));
// 	printf("RESULT3: %s\n", parseCommand(command3));
// }

