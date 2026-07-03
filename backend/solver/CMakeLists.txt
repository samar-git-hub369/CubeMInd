cmake_minimum_required(VERSION 3.15)
project(CubeMindSolver)

# We can ask Python for the pybind11 includes
execute_process(
    COMMAND python3 -m pybind11 --includes
    OUTPUT_VARIABLE PYBIND11_INCLUDES
    OUTPUT_STRIP_TRAILING_WHITESPACE
)

# Convert string to list
separate_arguments(PYBIND11_INCLUDES)

add_library(cubemind_solver MODULE kociemba.cpp)

# We need Python dev headers too
find_package(Python3 COMPONENTS Interpreter Development REQUIRED)

target_include_directories(cubemind_solver PRIVATE ${Python3_INCLUDE_DIRS})
# Add pybind11 includes
# The output of pybind11 --includes is like: -I/path/1 -I/path/2
# We can just append it to compile options
target_compile_options(cubemind_solver PRIVATE ${PYBIND11_INCLUDES} -O3 -std=c++14)

set_target_properties(cubemind_solver PROPERTIES 
    PREFIX "" 
    SUFFIX ".so"
)
if(APPLE)
    set_target_properties(cubemind_solver PROPERTIES SUFFIX ".so")
    set_target_properties(cubemind_solver PROPERTIES LINK_FLAGS "-undefined dynamic_lookup")
endif()
