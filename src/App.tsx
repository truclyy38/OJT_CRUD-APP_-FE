import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router} from 'react-router-dom';
import RouteRender from './RouteRender';

/**
 * App.jsx

 *
 * Version 1.0
 *
 * Date: 06-10-2021
 *
 * Copyright
 *
 * Modification Logs:
 * DATE                 AUTHOR          DESCRIPTION
 * -----------------------------------------------------------------------
 * 06-10-2021	         LyNTT9           Create
 */
function App() {
  return (
    <Router>
            <RouteRender />
    </Router>
  );
}

export default App;
