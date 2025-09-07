import { ArrowUpRightIcon } from 'lucide-react';

import {
  Announcement as AnnouncementComponent,
  AnnouncementTag,
  AnnouncementTitle,
} from '@elevenlabs/ui/components/ui/kibo-ui/announcement';

export function Announcement() {
  return (
    <AnnouncementComponent>
      <AnnouncementTag>Latest update</AnnouncementTag>
      <AnnouncementTitle>
        Agents SDK
        <ArrowUpRightIcon
          className="shrink-0 text-muted-foreground"
          size={16}
        />
      </AnnouncementTitle>
    </AnnouncementComponent>
  );
}
