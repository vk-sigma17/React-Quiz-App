# React Quiz App

**The app is a quiz game that fetches questions from an API and presents them to users. Users select answers, and once all questions are answered, they can check their score. The app uses React for state management, `html-react-parser` for rendering HTML in questions, and `lodash` for shuffling answer options. It also conditionally styles answer choices based on user interactions and quiz completion.**

## Technologies Used

- **React**: For building the user interface and managing state.
- **html-react-parser**: To safely render HTML content within React components.
- **Lodash**: For utility functions, specifically `_.shuffle` to randomize answer options.
- **CSS**: For styling the components and layout.
- **Fetch API**: For making HTTP requests to the quiz API.

## React Hooks Used

- **`useState`**: Manages the state of data, loading, answer mapping, user selections, results, score, quiz completion, and answer visibility.
- **`useEffect`**: Handles side effects, specifically updating the shuffled answer map whenever new quiz data is fetched.

