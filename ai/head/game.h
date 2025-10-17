#pragma once

#include <stdint.h>
#include <array>

#include "defines.h"

namespace game {

    bool check_win(uint16_t player_bits);

    std::array<uint16_t, 9> get_valid_moves(const STATE_T& state);

    STATE_T next_state(const STATE_T& state, int move, int player);

    

    void print_board(const STATE_T& state);
    void print_valid_moves(const std::array<uint16_t, 9>& valid_moves);

}