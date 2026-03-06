import { useAtom } from 'jotai';
import {
  CheckCircle2,
  GripVertical,
  Plus,
  Save,
  Timer,
  Trash2,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'sonner';

import AppLayout from '@/components/layout/AppLayout';
import ScanTab from '@/components/Scantab';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { surveysAtom } from '@/store';
import type { FormCategory, Question, QuestionType } from '@/store/types';
import { generateId } from '@/store/utils';

const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: '🔘 Multiple Choice',
  text: '✏️ Text Answer',
  rating: '⭐ Rating (1-5)',
  checkbox: '☑️ Checkbox (Multi)',
  dropdown: '📋 Dropdown',
  linear_scale: '📊 Linear Scale',
  date: '📅 Date',
  email: '📧 Email',
  phone: '📱 Phone',
  number: '🔢 Number',
  yes_no: '✅ Yes / No',
};

const categoryOptions: { value: FormCategory; label: string; icon: string }[] =
  [
    { value: 'survey', label: 'Survey', icon: '📝' },
    { value: 'quiz', label: 'Quiz', icon: '🧠' },
    { value: 'poll', label: 'Poll', icon: '📊' },
    { value: 'registration', label: 'Registration', icon: '🎫' },
    { value: 'feedback', label: 'Feedback', icon: '💬' },
    { value: 'custom', label: 'Custom', icon: '⚙️' },
  ];

export default function SurveyBuilder() {
  const [, setSurveys] = useAtom(surveysAtom);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FormCategory>('survey');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [successMessage, setSuccessMessage] = useState(
    'Thank you for your response!'
  );

  const addQuestion = (type: QuestionType = 'multiple_choice') => {
    const base: Question = {
      id: generateId(),
      type,
      title: '',
      required: true,
    };

    if (
      type === 'multiple_choice' ||
      type === 'checkbox' ||
      type === 'dropdown'
    ) {
      base.options = [
        { id: generateId(), text: 'Option 1' },
        { id: generateId(), text: 'Option 2' },
      ];
    }
    if (type === 'yes_no') {
      base.options = [
        { id: generateId(), text: 'Yes' },
        { id: generateId(), text: 'No' },
      ];
    }
    if (type === 'rating') base.maxRating = 5;
    if (type === 'linear_scale') {
      base.scaleMin = 1;
      base.scaleMax = 10;
      base.scaleMinLabel = 'Low';
      base.scaleMaxLabel = 'High';
    }
    if (category === 'quiz') base.points = 10;

    setQuestions((prev) => [...prev, base]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const addOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...(q.options || []),
                {
                  id: generateId(),
                  text: `Option ${(q.options?.length || 0) + 1}`,
                },
              ],
            }
          : q
      )
    );
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((o) =>
                o.id === optionId ? { ...o, text } : o
              ),
            }
          : q
      )
    );
  };

  const toggleCorrectOption = (questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((o) =>
                o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o
              ),
            }
          : q
      )
    );
  };

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options?.filter((o) => o.id !== optionId) }
          : q
      )
    );
  };

  const saveSurvey = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (questions.length === 0) {
      toast.error('Add at least one question');
      return;
    }
    for (const q of questions) {
      if (!q.title.trim()) {
        toast.error('All questions must have a title');
        return;
      }
    }

    const newSurvey = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      category,
      questions,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      responses: [],
      timerEnabled,
      timerMinutes: timerEnabled ? timerMinutes : undefined,
      showProgressBar,
      successMessage: successMessage.trim() || undefined,
    };

    setSurveys((prev) => [...prev, newSurvey]);
    toast.success('Form created! 🎉');
    router.push('/form/surveys');
  };

  const hasOptions = (type: QuestionType) =>
    ['multiple_choice', 'checkbox', 'dropdown', 'yes_no'].includes(type);

  return (
    <AppLayout>
      <div className='animate-fade-in space-y-6'>
        <div>
          <h1 className='font-heading text-3xl font-bold tracking-tight'>
            Create Form
          </h1>
          <p className='text-muted-foreground mt-1'>
            Build surveys, quizzes, polls, and more
          </p>
        </div>

        <Tabs defaultValue='details' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='questions'>
              Questions ({questions.length})
            </TabsTrigger>
            <TabsTrigger value='settings'>Settings</TabsTrigger>
            <TabsTrigger value='scan'>Scan Paper</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value='details'>
            <Card>
              <CardContent className='space-y-4 pt-6'>
                <div>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    id='title'
                    placeholder='e.g. Customer Satisfaction Survey'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='mt-1.5'
                  />
                </div>
                <div>
                  <Label htmlFor='desc'>Description (optional)</Label>
                  <Textarea
                    id='desc'
                    placeholder='Describe your form...'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='mt-1.5'
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Form Type</Label>
                  <div className='mt-1.5 grid grid-cols-3 gap-2 sm:grid-cols-6'>
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-xs font-medium transition-all ${
                          category === cat.value
                            ? 'border-primary bg-primary/5 text-foreground'
                            : 'border-border hover:border-primary/30 text-muted-foreground'
                        }`}
                      >
                        <span className='text-xl'>{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value='questions' className='space-y-4'>
            {questions.map((q, idx) => (
              <Card key={q.id}>
                <CardHeader className='flex flex-row items-start justify-between pb-3'>
                  <div className='flex items-center gap-2'>
                    <GripVertical className='text-muted-foreground/50 h-4 w-4' />
                    <CardTitle className='text-base'>Q{idx + 1}</CardTitle>
                    {category === 'quiz' && q.points && (
                      <Badge variant='secondary' className='text-xs'>
                        {q.points} pts
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => removeQuestion(q.id)}
                  >
                    <Trash2 className='text-destructive h-4 w-4' />
                  </Button>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div>
                      <Label>Question Text</Label>
                      <Input
                        placeholder='Enter your question'
                        value={q.title}
                        onChange={(e) =>
                          updateQuestion(q.id, { title: e.target.value })
                        }
                        className='mt-1.5'
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={q.type}
                        onValueChange={(val) => {
                          const type = val as QuestionType;
                          const updates: Partial<Question> = { type };
                          if (hasOptions(type) && !q.options?.length) {
                            updates.options = [
                              { id: generateId(), text: 'Option 1' },
                              { id: generateId(), text: 'Option 2' },
                            ];
                          }
                          if (type === 'yes_no') {
                            updates.options = [
                              { id: generateId(), text: 'Yes' },
                              { id: generateId(), text: 'No' },
                            ];
                          }
                          if (type === 'linear_scale' && !q.scaleMin) {
                            updates.scaleMin = 1;
                            updates.scaleMax = 10;
                            updates.scaleMinLabel = 'Low';
                            updates.scaleMaxLabel = 'High';
                          }
                          updateQuestion(q.id, updates);
                        }}
                      >
                        <SelectTrigger className='mt-1.5'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(questionTypeLabels).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Options for MCQ/Checkbox/Dropdown */}
                  {hasOptions(q.type) && q.type !== 'yes_no' && (
                    <div className='space-y-2'>
                      <Label>Options</Label>
                      {q.options?.map((opt) => (
                        <div key={opt.id} className='flex items-center gap-2'>
                          <Input
                            value={opt.text}
                            onChange={(e) =>
                              updateOption(q.id, opt.id, e.target.value)
                            }
                            className='flex-1'
                          />
                          {category === 'quiz' && (
                            <Button
                              variant={opt.isCorrect ? 'default' : 'outline'}
                              size='icon'
                              onClick={() => toggleCorrectOption(q.id, opt.id)}
                              title={
                                opt.isCorrect
                                  ? 'Correct answer'
                                  : 'Mark as correct'
                              }
                              className='shrink-0'
                            >
                              <CheckCircle2 className='h-3.5 w-3.5' />
                            </Button>
                          )}
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => removeOption(q.id, opt.id)}
                            disabled={(q.options?.length || 0) <= 2}
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addOption(q.id)}
                      >
                        <Plus className='mr-1 h-3.5 w-3.5' /> Add Option
                      </Button>
                    </div>
                  )}

                  {/* Linear Scale config */}
                  {q.type === 'linear_scale' && (
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <Label className='text-xs'>Min ({q.scaleMin})</Label>
                        <Input
                          type='number'
                          value={q.scaleMin ?? 1}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              scaleMin: Number(e.target.value),
                            })
                          }
                          className='mt-1'
                        />
                        <Input
                          placeholder='Min label'
                          value={q.scaleMinLabel ?? ''}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              scaleMinLabel: e.target.value,
                            })
                          }
                          className='mt-1'
                        />
                      </div>
                      <div>
                        <Label className='text-xs'>Max ({q.scaleMax})</Label>
                        <Input
                          type='number'
                          value={q.scaleMax ?? 10}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              scaleMax: Number(e.target.value),
                            })
                          }
                          className='mt-1'
                        />
                        <Input
                          placeholder='Max label'
                          value={q.scaleMaxLabel ?? ''}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              scaleMaxLabel: e.target.value,
                            })
                          }
                          className='mt-1'
                        />
                      </div>
                    </div>
                  )}

                  {/* Quiz points */}
                  {category === 'quiz' && (
                    <div className='flex items-center gap-3'>
                      <Label className='text-sm'>Points:</Label>
                      <Input
                        type='number'
                        value={q.points ?? 10}
                        onChange={(e) =>
                          updateQuestion(q.id, {
                            points: Number(e.target.value),
                          })
                        }
                        className='w-20'
                      />
                    </div>
                  )}

                  <div className='flex items-center gap-2'>
                    <Switch
                      checked={q.required}
                      onCheckedChange={(val) =>
                        updateQuestion(q.id, { required: val })
                      }
                      id={`req-${q.id}`}
                    />
                    <Label htmlFor={`req-${q.id}`} className='text-sm'>
                      Required
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add question buttons */}
            <Card className='border-dashed'>
              <CardContent className='py-6'>
                <p className='text-muted-foreground mb-3 text-sm font-medium'>
                  Add a question
                </p>
                <div className='flex flex-wrap gap-2'>
                  {(
                    Object.entries(questionTypeLabels) as [
                      QuestionType,
                      string
                    ][]
                  ).map(([type, label]) => (
                    <Button
                      key={type}
                      variant='outline'
                      size='sm'
                      onClick={() => addQuestion(type)}
                      className='text-xs'
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value='settings'>
            <div className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Timer className='h-4 w-4' /> Timer
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <Switch
                      checked={timerEnabled}
                      onCheckedChange={setTimerEnabled}
                      id='timer'
                    />
                    <Label htmlFor='timer'>Enable countdown timer</Label>
                  </div>
                  {timerEnabled && (
                    <div className='flex items-center gap-2'>
                      <Input
                        type='number'
                        value={timerMinutes}
                        onChange={(e) =>
                          setTimerMinutes(Number(e.target.value))
                        }
                        className='w-24'
                        min={1}
                        max={300}
                      />
                      <span className='text-muted-foreground text-sm'>
                        minutes
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Zap className='h-4 w-4' /> Behavior
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <Switch
                      checked={showProgressBar}
                      onCheckedChange={setShowProgressBar}
                      id='progress'
                    />
                    <Label htmlFor='progress'>Show progress bar</Label>
                  </div>
                  <div>
                    <Label>Success message</Label>
                    <Input
                      value={successMessage}
                      onChange={(e) => setSuccessMessage(e.target.value)}
                      className='mt-1.5'
                      placeholder='Thank you!'
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scan Tab */}
          <TabsContent value='scan'>
            <ScanTab
              onQuestionsExtracted={(newQs: any) =>
                setQuestions((prev) => [...prev, ...newQs])
              }
            />
          </TabsContent>
        </Tabs>

        <div className='flex gap-3'>
          <Button
            onClick={saveSurvey}
            disabled={questions.length === 0}
            className='flex-1'
          >
            <Save className='mr-2 h-4 w-4' /> Save Form
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
