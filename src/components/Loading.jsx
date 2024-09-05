import RabbitGif from "../assets/rabbit.gif";

function Loading(props) {
    return (
        <div className="loading_div">
            <img src= {RabbitGif} alt='로딩 이미지'/>
        </div>
    );
}

export default Loading;