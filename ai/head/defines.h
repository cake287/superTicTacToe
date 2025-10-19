#pragma once
#include <stdint.h>
#include <bitset>

// HYPERPARAMETERS
#define MCTS_SIMS 800





// board is stored in 32 bits. Least significant 9 are player 1. 16-25 are player 2.
// a full game state is an array of 11 uint32_t. state[0:8] are the minor boards. state[9] is the major board. state[10] describes the minor boards which can be played on.

#define STATE_T std::array<uint32_t, 11>
#define MOVE_SET_T std::array<float, 81>



// DEBUG
#define PRINT_16(num) std::cout << std::bitset<16>(num) << std::endl
#define PRINT_32(num) std::cout << std::bitset<32>(num) << std::endl