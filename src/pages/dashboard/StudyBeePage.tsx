
import React from 'react';
import { PageWrapper } from "@/components/ui/page-wrapper";
import { StudyBeeIntegration } from "@/components/studybee/StudyBeeIntegration";
import { StudyBeeMessaging } from "@/components/studybee/StudyBeeMessaging";

const StudyBeePage: React.FC = () => {
  return (
    <PageWrapper
      title="Study Bee"
      description="Your personal study companion for enhanced learning and productivity"
    >
      <StudyBeeIntegration />
      <StudyBeeMessaging />
    </PageWrapper>
  );
};

export default StudyBeePage;
