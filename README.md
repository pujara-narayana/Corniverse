
# Corniverse

Corniverse is an immersive space simulation designed to answer one of humanity's most interesting questions: How much corn can we grow on Earth and Mars? Through a combination of 3D models, AI-driven predictions, and interactive features.

# Features:

* Immerse yourself in a visual experience while exploring realistic 3D models of Earth and Mars, showcasing crop growth potential in both environments.
* Trained AI models that predict crop yields over vast time periods, using past data and information to simulate growth on both Earth and Mars.
* Predictions conducted not only on Earth, but also Mars
* Navigate through a free camera view of the environment, offering a hands-on experience with the virtual landscape.
* View data predictions and results through easy-to-understand graphs and visualizations.
* An integrated AI chatbot to assist with any questions you may have about the simulation, predictions, or the project itself.

## Developed by

* Samarpan Mohanty
* Narayana Pujara
* Trung Huynh

## Setup & Installation

1. Create and activate virtual environment:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install required packages:
```bash
pip install pandas, numpy, matplotlib, seaborn, scikit-learn fastapi, pydantic, uvicorn, json, random, statistics
```
```bash
npm i 
```
This command will install all the packages required such as @react-three/fiber, @react-three/drei, typescript, and tailwindcss etc...

## Run Locally

Clone the project

```bash
  git clone https://github.com/pujara-narayana/Corniverse-.git
```

Go to the corn-odyssey-ui directory

```bash
  cd corn-odyssey-ui
```

Start the local server

```bash
  npm run dev
```

Start Python server 

```bash
  uvicorn main:app --host 0.0.0.0 --port 8000
```