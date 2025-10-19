#include "game.h"
#include "mcts.h"
#include "model.h"
#include <iostream>

void play_two_player_game() {
    STATE_T state = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0b111111111};
    game::print_board(state);

    int player = 1;

    while (true) {
        // input moves
        std::cout << "Player " << (player == 1 ? "X" : "O") << ", enter your move (major minor): ";
        int major_move = -1;
        int minor_move = -1;
        std::cin >> major_move >> minor_move;

        int move = major_move * 9 + minor_move;

        MOVE_SET_T valid_moves = game::get_valid_moves(state);
        if (!valid_moves[major_move*9 + minor_move]) {
            std::cout << "Invalid move, try again." << std::endl;
            continue;
        }

        state = game::next_state(state, move, player);
        game::get_valid_moves(state);

        game::print_board(state);

        player *= -1;
    }
}


int main() {
    STATE_T state = {0, 0b111111100, 0, 0, 0, 0, 0, 0, 0, 0, 0b10};

    Model model = {};

    MCTS::Node root_node(0.0f, -1);
    float value = 0.0f;
    root_node.expand(state, &value, model);


    return 0;
}