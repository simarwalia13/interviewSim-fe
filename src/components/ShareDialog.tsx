import { Check, Copy, Mail, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ShareDialogProps {
  surveyId: string;
  surveyTitle: string;
}

export default function ShareDialog({
  surveyId,
  surveyTitle,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/survey/${surveyId}/respond`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`Take this survey: ${surveyTitle}`);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      name: 'Twitter / X',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'bg-foreground hover:bg-foreground/90',
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
  ];

  const emailSubject = encodeURIComponent(`Invitation: ${surveyTitle}`);
  const emailBody = encodeURIComponent(
    `Hi,\n\nPlease take a moment to fill out this survey:\n\n${surveyTitle}\n${shareUrl}\n\nThank you!`
  );

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" style="border:none;border-radius:12px;"></iframe>`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' title='Share'>
          <Share2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-heading'>
            Share "{surveyTitle}"
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue='link' className='mt-2'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='link'>Link</TabsTrigger>
            <TabsTrigger value='social'>Social</TabsTrigger>
            <TabsTrigger value='qr'>QR Code</TabsTrigger>
            <TabsTrigger value='embed'>Embed</TabsTrigger>
          </TabsList>

          <TabsContent value='link' className='mt-4 space-y-4'>
            <div>
              <Label>Survey Link</Label>
              <div className='mt-1.5 flex gap-2'>
                <Input value={shareUrl} readOnly className='text-sm' />
                <Button
                  onClick={copyLink}
                  variant='outline'
                  size='icon'
                  className='shrink-0'
                >
                  {copied ? (
                    <Check className='h-4 w-4 text-green-500' />
                  ) : (
                    <Copy className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </div>
            <a href={`mailto:?subject=${emailSubject}&body=${emailBody}`}>
              <Button variant='outline' className='w-full'>
                <Mail className='mr-2 h-4 w-4' /> Send via Email
              </Button>
            </a>
          </TabsContent>

          <TabsContent value='social' className='mt-4'>
            <div className='grid grid-cols-1 gap-2'>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button
                    variant='outline'
                    className='h-11 w-full justify-start gap-3'
                  >
                    <span className='text-lg'>{social.icon}</span>
                    {social.name}
                  </Button>
                </a>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='qr' className='mt-4'>
            <div className='flex flex-col items-center gap-4'>
              <div className='border-border rounded-xl border bg-white p-4'>
                <QRCodeSVG
                  value={shareUrl}
                  size={200}
                  level='H'
                  includeMargin
                />
              </div>
              <p className='text-muted-foreground text-center text-sm'>
                Scan this QR code to open the survey
              </p>
              <Button variant='outline' onClick={copyLink}>
                <Copy className='mr-2 h-4 w-4' /> Copy Link
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='embed' className='mt-4 space-y-3'>
            <div>
              <Label>Embed Code</Label>
              <textarea
                readOnly
                value={embedCode}
                className='border-input bg-muted mt-1.5 h-20 w-full resize-none rounded-md border px-3 py-2 font-mono text-xs'
              />
            </div>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                toast.success('Embed code copied!');
              }}
            >
              <Copy className='mr-2 h-4 w-4' /> Copy Embed Code
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
