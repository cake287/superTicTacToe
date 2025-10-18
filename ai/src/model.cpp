#include "model.h"
#include <array>

Model::Model() {
}
Model::~Model() {
}

void Model::predict(const STATE_T& state, std::array<float, 81>* policy_output, float* value_output) {
    // placeholder

    policy_output->fill(1.0f / 81.0f); // uniform distribution

    *value_output = 0.0f; // neutral value
}