type Template = {
  name: string;
  blocks: any[];
};

type SidebarProps = {
  onTemplateSelect: (blocks: any[]) => void;
};

const defaultTemplates: Template[] = [
  {
    name: 'Blank',
    blocks: [],
  },
  {
    name: 'Welcome',
    blocks: [
      { type: 'heading', content: 'Welcome to Our Service!' },
      {
        type: 'paragraph',
        content: 'We are excited to have you on board. Get started by exploring our features.',
      },
      {
        type: 'button',
        content: 'Get Started',
        url: 'https://example.com',
        backgroundColor: '#007bff',
        textColor: '#fff',
      },
    ],
  },
  {
    name: 'Receipt',
    blocks: [
      { type: 'heading', content: 'Your Receipt' },
      { type: 'paragraph', content: 'Thank you for your purchase! Here are your order details:' },
      { type: 'paragraph', content: 'Order #123456\nTotal: $49.99' },
      {
        type: 'button',
        content: 'View Order',
        url: 'https://example.com/orders',
        backgroundColor: '#10b981',
        textColor: '#fff',
      },
    ],
  },
  {
    name: 'OTP',
    blocks: [
      { type: 'heading', content: 'Your One-Time Passcode' },
      { type: 'paragraph', content: 'Use the code below to sign in:' },
      { type: 'heading', content: '123456', level: 2 },
    ],
  },
  {
    name: 'Reset Password',
    blocks: [
      { type: 'heading', content: 'Reset Your Password' },
      { type: 'paragraph', content: 'Click the button below to reset your password.' },
      {
        type: 'button',
        content: 'Reset Password',
        url: 'https://example.com/reset',
        backgroundColor: '#f59e42',
        textColor: '#fff',
      },
    ],
  },
];
export default function Sidebar({ onTemplateSelect }: SidebarProps) {
  return (
    <div className="w-72 border-r p-4 bg-background flex flex-col" style={{ height: '100%' }}>
      <div className="font-semibold mb-3">Templates</div>
      <ul className="flex flex-col gap-2">
        {defaultTemplates.map((tpl) => (
          <li
            key={tpl.name}
            className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
            onClick={() => onTemplateSelect(tpl.blocks)}
            style={{ background: tpl.name === 'Blank' ? '#f9fafb' : '' }}
          >
            <span>{tpl.name}</span>
            {/* {getTemplatePreview(tpl.blocks, tpl.name)} */}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-muted-foreground text-xs">
        Choose a template to quickly start your email. You can fully customize the content after loading a template.
      </div>
    </div>
  );
}
