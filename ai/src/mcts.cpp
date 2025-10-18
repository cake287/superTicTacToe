#include "mcts.h"
#include "game.h"
#include <iostream>

namespace MCTS {

    Node::~Node() {
        for (Node* child : children) {
            delete child;
        }
    }

    void Node::expand(const STATE_T _state, float* value_out, Model& model) {
        if (expanded) return;

        state = _state;

        MOVE_SET_T pred_probs = {};
        float value = 0.0f;
        model.predict(state, &pred_probs, &value);
        *value_out = value;

        MOVE_SET_T valid_moves = game::get_valid_moves(state);

        float valid_prob_sum = 0.0f;
        for (size_t i = 0; i < 81; ++i) {
            if (valid_moves[i]) {
                valid_prob_sum += pred_probs[i];
                children.push_back(new Node(pred_probs[i], i));
            }
        }

        // Normalize prior probabilities
        for (Node* child : children) {
            child->prior_probability /= valid_prob_sum;

            std::cout << (int)child->action << ": " << child->prior_probability << std::endl;
        }
        

        expanded = true;
    }

    Node* Node::select_child() {
        // Placeholder for selection logic (e.g., UCT)
        if (children.empty()) return nullptr;
        return children[0]; // Simplified: always return the first child
    }

    bool Node::is_expanded() const {
        return expanded;
    }

}