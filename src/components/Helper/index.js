export const calculateTimeAgo = (timestamp) => {
    const createdAt = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = Math.round((currentTime - createdAt) / 60000); // Chuyển đổi thành phút
    if (timeDifference < 1) {
      return 'Vừa xong';
    } else if (timeDifference < 60) {
      return timeDifference + ' phút trước';
    } else if (timeDifference < 1440) {
      return Math.round(timeDifference / 60) + ' giờ trước';
    } else {
      return Math.round(timeDifference / 1440) + ' ngày trước';
    }
  };