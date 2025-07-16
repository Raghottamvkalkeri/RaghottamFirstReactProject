// Import React hooks: useState for state management and useEffect for side effects
import { useState, useEffect } from "react";

// Card component that accepts title and name as props
const Card = ({ title, name }) => {
    // State to track if the user has verified
    const [hasVerified, setHasVerified] = useState(false);
    // State to track number of times the card is clicked
    const [count, setCount] = useState(0);

    // useEffect runs whenever 'hasVerified' or 'name' changes
    useEffect(() => {
        console.log({ name }, 'has ' + (hasVerified ? 'verified' : 'not verified'));
    }, [hasVerified, name]);

    return (
        <div className="card" onClick={() => setCount(count + 1)}>
            {/* Display name and count; if count is 0, shows null */}
            <h1>{name} - {count || null}</h1>
            <h2>{title}</h2>

            {/* Button to toggle verification state */}
            <button onClick={() => setHasVerified(!hasVerified)}>
                {hasVerified ? 'Verified' : 'Verify'}
            </button>
        </div>
    );
}

// App component that renders the Card
const App = () => {
    return (
        <div className="card-container">
            {/* Passing props to Card component */}
            <Card title="Senior Software Engineer" name="Raghottam V Kalkeri" />
        </div>
    )
}

// Export the App component as the default export
export default App;