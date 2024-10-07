// Kiểm tra xem trình duyệt có hỗ trợ Web Speech API không
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();

    // Cấu hình recognition
    recognition.continuous = true; // Nhận diện liên tục
    recognition.interimResults = false; // Không hiển thị kết quả tạm thời
    recognition.lang = 'en-US'; // Ngôn ngữ sử dụng

    // Lấy các phần tử HTML
    const startButton = document.getElementById('start-record');
    const stopButton = document.getElementById('stop-record');
    const transcriptDisplay = document.getElementById('transcript');

    let finalTranscript = '';

    // Bắt đầu ghi âm
    startButton.addEventListener('click', () => {
        recognition.start();
        transcriptDisplay.innerText = 'Listening...';
    });

    // Dừng ghi âm
    stopButton.addEventListener('click', () => {
        recognition.stop();
        transcriptDisplay.innerText = 'Stopped listening.';
    });

    // Xử lý kết quả nhận diện giọng nói
    recognition.onresult = (event) => {
        finalTranscript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        transcriptDisplay.innerText = finalTranscript;
    };

    // Gửi transcript đến API khi dừng ghi âm
    recognition.onend = () => {
        if (finalTranscript) {
            // Gửi dữ liệu đến API dưới dạng plain text
            fetch('http://192.168.31.239/post-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain', // Sử dụng plain text thay vì JSON
                },
                body: finalTranscript // Gửi trực tiếp văn bản mà không gói trong JSON
            })
            .then(response => response.text()) // Xử lý phản hồi dưới dạng text
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    };

    // Xử lý lỗi
    recognition.onerror = (event) => {
        transcriptDisplay.innerText = `Error occurred in recognition: ${event.error}`;
    };
} else {
    alert('Web Speech API is not supported in this browser.');
}
