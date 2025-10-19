#include "game.h"
#include <iostream>

namespace game {
    uint16_t get_free_cells(uint32_t board) {
        uint16_t x_cells = board & 0x1FF;
        uint16_t o_cells = (board >> 16) & 0x1FF;
        return ~(x_cells | o_cells) & 0x1FF;
    };
    uint16_t get_player_bits(uint32_t board, int player) {
        return (player == 1) ? (board & 0x1FF) : ((board >> 16) & 0x1FF);
    }



    bool check_win(uint16_t player_bits) {
        static const std::array<uint16_t, 8> win_masks = {
            0b0000000000000111, // Row 1 (positions 0,1,2)
            0b0000000000111000, // Row 2 (positions 3,4,5)
            0b0000001110000000, // Row 3 (positions 6,7,8)
            0b000000001001001, // Col 1 (positions 0,3,6)
            0b000000010010010, // Col 2 (positions 1,4,7)
            0b000000100100100, // Col 3 (positions 2,5,8)
            0b000000100010001, // Diag 1 (positions 0,4,8)
            0b000000001010100  // Diag 2 (positions 2,4,6)
        };
        for (uint16_t mask : win_masks) {
            if ((player_bits & mask) == mask) {
                return true;
            }
        }
        return false;
    }

    MOVE_SET_T get_valid_moves(const STATE_T& state) {
        // valid minor boards are ones which have not been won yet (i.e. free cells in major board) 
        // and are available to play in (i.e. marked in state[10])
        uint16_t valid_major_moves = get_free_cells(state[9]) & state[10];

        std::array<float, 81> valid_moves;
        for (int majorI = 0; majorI < 9; ++majorI) {
            uint16_t valid_minor_moves = get_free_cells(state[majorI]);

            for (int minorI = 0; minorI < 9; ++minorI) {
                valid_moves[majorI * 9 + minorI] = 
                    ((valid_major_moves >> majorI) & 1) & 
                    (((valid_minor_moves >> minorI) & 1)); // 1 for valid, 0 for not valid
            }
        }

        return valid_moves;
    }

    STATE_T next_state(const STATE_T& state, signed char move, signed char player) {
        STATE_T new_state = state;

        int minor_board_index = move / 9;
        int cell_index = move % 9;

        uint32_t& minor_board = new_state[minor_board_index];
        uint32_t& major_board = new_state[9];
        uint32_t& available_boards = new_state[10];

        uint32_t player_bit = (player == 1) ? (1 << cell_index) : (1 << (cell_index + 16));
        minor_board |= player_bit;

        // Check if the minor board has been won
        if (check_win(get_player_bits(minor_board, player))) {
            uint32_t major_bit = (player == 1) ? (1 << minor_board_index) : (1 << (minor_board_index + 16));
            major_board |= major_bit;
        }

        // Determine the next available boards based on the cell just played
        int next_board_index = cell_index;
        if ((major_board & (1 << next_board_index)) || (major_board & (1 << (next_board_index + 16)))) { // If the targeted board is won
            // All non-won boards are available
            available_boards = get_free_cells(major_board);
        } else {
            // Only the targeted board is available
            available_boards = (1 << next_board_index);
        }

        return new_state;
    }



    void print_board(const STATE_T& state) {
        auto print_cell = [&](const uint32_t board, int row, int col) {
            int i = row * 3 + col;
            bool p1 = (board & (1 << i)) != 0;
            bool p2 = (board & (1 << (i + 16))) != 0;
            if (p1) {
                std::cout << "X";
            } else if (p2) {
                std::cout << "O";
            } else {
                std::cout << ".";
            }
        };

        for (int major_row = 0; major_row < 3; ++major_row) {
            for (int minor_row = 0; minor_row < 3; ++minor_row) {
                for (int major_col = 0; major_col < 3; ++major_col) {
                    for (int minor_col = 0; minor_col < 3; ++minor_col) {
                        print_cell(state[major_row * 3 + major_col], minor_row, minor_col);
                    }
                    if (major_col < 2) std::cout << " | ";
                }
                std::cout << "\n";
            }
            for (int major_col = 0; major_col < 3; ++major_col) {
                int i = major_row * 3 + major_col;

                std::cout << " ";
                print_cell(state[9], major_row, major_col);

                if (state[10] & (1 << i)) std::cout << "#";
                else std::cout << " ";

                if (major_col < 2) std::cout << " | ";
                else std::cout << "\n";
            }
            if (major_row < 2) {
                std::cout << "----------------\n";
            }
        }
        std::cout << std::endl;
    }

    void print_valid_moves(const MOVE_SET_T& valid_moves) {
        for (int major_row = 0; major_row < 3; ++major_row) {
            for (int minor_row = 0; minor_row < 3; ++minor_row) {
                for (int major_col = 0; major_col < 3; ++major_col) {
                    for (int minor_col = 0; minor_col < 3; ++minor_col) {
                        int move_index = (major_row * 3 + major_col) * 9 + (minor_row * 3 + minor_col);
                        if (valid_moves[move_index] > 0.0f) {
                            std::cout << "#";
                        } else {
                            std::cout << ".";
                        }
                    }
                    if (major_col < 2) std::cout << " | ";
                }
                std::cout << "\n";
            }
            if (major_row < 2) {
                std::cout << "----------------\n";
            }
        }
        std::cout << std::endl;
    }
}
