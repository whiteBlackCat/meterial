
import '../assets/styles/global.styl'

export default {
    data(){
        "use strict";
        return {
            author:'Jocky'
        }
    },
    render(){
        "use strict";
        return (
            <div id="footer">
                <span>Written by {this.author}</span>
            </div>
        )
    }
}