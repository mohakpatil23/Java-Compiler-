Java Compiler & Code Runner (Replit Build)

A modern, lightweight, and efficient Java Compiler & Runner built using core Java and developed on Replit. This project allows users to compile and execute Java programs dynamically, without installing a heavy IDE. It serves as a clean reference for integrating Java’s built-in compiler tools inside custom applications.

🚀 Project Overview

This project uses the JDK Compiler API (javax.tools.JavaCompiler) to compile Java source code at runtime.
It takes a .java file or raw Java code as input, compiles it, handles errors, and executes the resulting .class file—similar to how small IDEs and online compilers work.

The goal of this project is to offer a fast, simple, and educational compiler environment suitable for students, educators, and developers.

Key objectives:

Provide an embedded Java compilation workflow

Implement clear and structured error handling

Make Java program execution simple and fast

Offer a modular codebase that can evolve into a full mini-IDE

📌 Features

Dynamic Java source compilation

Instant program execution

Clean and readable error messages

Zero external libraries (pure Java)

Beginner-friendly structure

Works on Replit, Windows, macOS, and Linux

Modular, extendable, and well-documented

🛠️ Tech Stack

Java JDK 8+

JDK Compiler API (javax.tools)

Replit IDE

📁 Project Structure
java-compiler/
│── src/
│   └── Main.java
│   └── CompilerEngine.java
│── input/
│   └── Test.java
│── output/
│   └── Compiled classes here
└── README.md

▶️ How to Run the Project
On Replit

Import the repo to Replit

Set environment to Java

Click Run

Follow on-screen instructions to compile & run Java code

On Local Machine

Install Java JDK 8 or higher

Open terminal in project directory

Compile:

javac src/Main.java


Run:

java -cp src Main

📦 Usage Example

Place your Java file (e.g., Test.java) in the input folder.
Run the program — the compiler will:

Compile the file

Display errors (if any)

Execute the class and show output

🤝 Contributing

Contributions are welcome!
For major changes, please open an issue first.

📄 License

This project is licensed under the MIT License.

👤 Author

Mohak Patil
Developed and deployed using Replit → GitHub.
