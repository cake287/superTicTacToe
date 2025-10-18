#pragma once

#include "defines.h"

class Model {
public:
    Model();
    ~Model();

    void predict(const STATE_T& state, std::array<float, 81>* policy_output, float* value_output);
};