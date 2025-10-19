#pragma once

#include "defines.h"
#include "game.h"
#include "model.h"
#include <vector>

namespace MCTS {
    class Node {
        public:
            Node(float prior_prob, signed char action)
                : prior_probability(prior_prob), action(action) {};
            ~Node();

            STATE_T state; // only used when expanded
            signed char action; // action that moved from parent state to this state
            std::vector<Node*> children = {};

            float prior_probability;
            int visit_count = 0;
            float total_value = 0.0f;

            void expand(const STATE_T _state, float* value_out, Model& model);
            Node* select_child();
            
            
            float get_mean_value() const {
                return (visit_count == 0) ? 0.0f : (total_value / visit_count);
            }    

            bool is_expanded() const {
                return expanded;
            }
            

        private:
            bool expanded = false;
    };

    float ucb_score(Node& parent, Node& child);
    
    Node* tree_search(STATE_T& root_state, Model& model, signed char player_to_move);
}