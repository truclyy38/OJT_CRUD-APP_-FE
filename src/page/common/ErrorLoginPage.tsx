import { useHistory } from "react-router"

/**
 * ErrorLoginPage

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
export const ErrorLoginPage =()=>{

    let history= useHistory();
    const backToHomepage =()=>{
       history.push('/');
    }

    return(
        <div className="error-contain">
                <span className="text-muted">
                    Sorry, something went wrong ! 
                </span>
                <button onClick={backToHomepage} style={{width:"100px", height:"30px"}}>Try again</button>
        </div>
    )
}