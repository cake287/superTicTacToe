#include "mcts.h"
#include "game.h"
#include <iostream>
#include <limits>
#include <math.h>

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
            // std::cout << (int)child->action << ": " << child->prior_probability << std::endl;
        }
        
        expanded = true;
    }

    Node* Node::select_child() {
        // Select child with highest UCB score

        float best_score = -std::numeric_limits<float>::max();
        Node* best_child = nullptr;
        for (Node* child : children) {
            float score = ucb_score(*this, *child);
            if (score > best_score) {
                best_score = score;
                best_child = child;
            }
        }

        return best_child;
    }
    

    float ucb_score(Node& parent, Node& child) {
        float prior_score = child.prior_probability * sqrt(parent.visit_count) / (child.visit_count + 1);
        float value_score;
        if (child.visit_count > 0) {
            value_score = -child.get_mean_value(); // value of the child state is from the perspective of the opposing player
        } else {
            value_score = 0;
        }

        return value_score + prior_score;
    }

}