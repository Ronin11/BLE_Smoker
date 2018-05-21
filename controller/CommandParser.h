#ifndef COMMAND_PARSER_H
#define COMMAND_PARSER_H

typedef struct
{
  char* commandString;
  char* (*setFunc)(char* input);
  char* (*getFunc)();
} Command;

typedef struct
{
  Command* commands;
  int length;
} CommandList;

char* parseCommand(char commandString[]);
void addCommand(char commandString[], char* (*setFunc)(char* input), char* (*getFunc)());

#endif