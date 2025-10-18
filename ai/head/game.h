#pragma once

#include <stdint.h>
#include <array>

#include "defines.h"

namespace game {

    bool check_win(uint16_t player_bits);

    MOVE_SET_T get_valid_moves(const STATE_T& state);

    STATE_T next_state(const STATE_T& state, int move, int player);

    

    void print_board(const STATE_T& state);
    void print_valid_moves(const MOVE_SET_T& valid_moves);

}