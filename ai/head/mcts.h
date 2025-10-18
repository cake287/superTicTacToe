#pragma once

#include "defines.h"
#include "game.h"
#include "model.h"
#include <vector>

namespace MCTS {
    class Node {
        public:
            Node(float prior_prob, char action)
                : prior_probability(prior_prob), action(action) {};
            ~Node();

            STATE_T state;
            char action;
            std::vector<Node*> children = {};

            float prior_probability;
            int visit_count = 0;
            double total_value = 0.0;

            void expand(const STATE_T _state, float* value_out, Model& model);
            Node* select_child();

            bool is_expanded() const {
                return expanded;
            }
            

        private:
            bool expanded = false;
    };


}