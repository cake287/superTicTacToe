cmake_minimum_required(VERSION 3.10)
project(SuperTicTacToeAI)

set(SOURCES
    src/main.cpp
    src/game.cpp 
)

# Create the executable
add_executable(SuperTicTacToeAI ${SOURCES})

# Include directories for header files
target_include_directories(SuperTicTacToeAI PRIVATE head)