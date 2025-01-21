const MessageLoading = () => {
  return (
    <div className="inline-block space-x-2 bg-gray-200 p-4 rounded-lg">
      <div className="flex items-center justify-center space-x-2">
        <span className="sr-only">Loading...</span>
        <div className="size-1 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="size-1 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="size-1 bg-black rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default MessageLoading;
