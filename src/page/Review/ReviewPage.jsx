import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";

function ReviewPage() {
  const [reviewList, setReviewList] = useState();
  const { reviewId } = useParams();

  return (
    <div className="h-[calc(100vh-66px)] w-full">
      <div className="flex flex-col h-full">
        <div className="h-[50px] min-h-[50px] bg-white border-b border-gray-300 p-6">
          <div className="flex items-center h-full">
            <h1 className="font-medium text-blue-gray-800">
              {reviewId ? "Review detail" : "List of reviews"}
            </h1>
          </div>
        </div>
        <div className="grow overflow-y-auto">
          <Outlet context={{ reviewList, setReviewList }} />
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
