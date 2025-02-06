"use client";

const CopyLink = ({ id }: { id: number }) => {
  const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/?p=${id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div>
      <div
        onClick={copyToClipboard}
        className="border flex gap-4 items-center border-gray-300 border-dashed rounded-lg w-min text-nowrap p-2 px-6 text-sm"
      >
        <p>{url}</p>
      </div>
    </div>
  );
};

export default CopyLink;
