"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/LanguageContext"
import { useGamepadType } from "@/contexts/GamepadTypeContext"
import { format } from "date-fns"
import { 
  Save, 
  Trash2, 
  Download, 
  MoreVertical, 
  Plus,
  Check,
  ArrowDownToLine,
  GanttChart,
  MoveRight
} from "lucide-react"
import type { GamepadProfile } from "@/hooks/useGamepadService"

interface GamepadProfileManagerProps {
  gamepadConnected: boolean
  profiles: GamepadProfile[]
  activeProfileId: string | null
  saveProfile: (name: string) => string | null
  loadProfile: (profileId: string) => boolean
  updateProfile: (profileId: string) => boolean
  deleteProfile: (profileId: string) => void
}

export function GamepadProfileManager({
  gamepadConnected,
  profiles,
  activeProfileId,
  saveProfile,
  loadProfile,
  updateProfile,
  deleteProfile,
}: GamepadProfileManagerProps) {
  const { t, direction, currentLanguage } = useLanguage()
  const { controllerType, controllerTypeLabel, controllerAuthenticity, authenticityLabel } = useGamepadType()
  const [newProfileName, setNewProfileName] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  // Create a new profile
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      alert(currentLanguage === 'en' 
        ? "Please enter a profile name"
        : "الرجاء إدخال اسم للملف الشخصي");
      return;
    }
    
    const result = saveProfile(newProfileName.trim());
    if (result) {
      setNewProfileName("");
      setDialogOpen(false);
    }
  }

  // Format date for display
  const formatLastUsed = (timestamp: number) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return "Unknown";
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : ''} justify-between`}>
          <span>{currentLanguage === 'en' ? 'Gamepad Profiles' : 'ملفات وحدة التحكم'}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => activeProfileId && updateProfile(activeProfileId)}
            disabled={!gamepadConnected || !activeProfileId}
          >
            <Save className="h-4 w-4 mr-2" />
            <span>{currentLanguage === 'en' ? 'Save Changes' : 'حفظ التغييرات'}</span>
          </Button>
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'en' 
            ? 'Save and manage calibration profiles for your gamepads'
            : 'حفظ وإدارة ملفات معايرة وحدات التحكم الخاصة بك'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Device info card */}
          <Card className="border border-dashed">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">
                    {currentLanguage === 'en' ? 'Controller Type' : 'نوع وحدة التحكم'}
                  </Label>
                  <div className="font-medium">{controllerTypeLabel}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">
                    {currentLanguage === 'en' ? 'Authenticity' : 'الأصالة'}
                  </Label>
                  <div className="font-medium">
                    {authenticityLabel}
                    {controllerAuthenticity === 'original' && <Check className="inline-block h-4 w-4 ml-1 text-green-500" />}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile list */}
          <div className="space-y-2">
            <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <h3 className="font-medium text-sm">
                {currentLanguage === 'en' 
                  ? 'Saved Profiles' 
                  : 'الملفات الشخصية المحفوظة'} 
                ({profiles.length})
              </h3>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={!gamepadConnected}>
                    <Plus className="h-4 w-4 mr-1" />
                    <span>{currentLanguage === 'en' ? 'New' : 'جديد'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{currentLanguage === 'en' ? 'Create New Profile' : 'إنشاء ملف تعريف جديد'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="profile-name">
                        {currentLanguage === 'en' ? 'Profile Name' : 'اسم الملف الشخصي'}
                      </Label>
                      <Input
                        id="profile-name"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder={currentLanguage === 'en' ? "Enter profile name" : "أدخل اسم الملف الشخصي"}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCreateProfile();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateProfile}>
                      {currentLanguage === 'en' ? 'Create Profile' : 'إنشاء الملف الشخصي'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {profiles.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground border rounded-md">
                {currentLanguage === 'en' 
                  ? 'No profiles saved yet. Create a profile to save your calibration settings.'
                  : 'لم يتم حفظ أي ملفات شخصية بعد. قم بإنشاء ملف شخصي لحفظ إعدادات المعايرة الخاصة بك.'}
              </div>
            ) : (
              <div className="space-y-2">
                {profiles.map((profile) => (
                  <Card 
                    key={profile.id} 
                    className={`${activeProfileId === profile.id ? 'border-primary' : ''}`}
                  >
                    <CardContent className="p-3">
                      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <div>
                          <div className="font-medium">{profile.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <GanttChart className="h-3 w-3 mr-1" />
                            <span>
                              {currentLanguage === 'en' ? 'Last used: ' : 'آخر استخدام: '}
                              {formatLastUsed(profile.lastUsed)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {activeProfileId !== profile.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => loadProfile(profile.id)}
                              disabled={!gamepadConnected}
                            >
                              <ArrowDownToLine className="h-4 w-4" />
                              <span className="sr-only">
                                {currentLanguage === 'en' ? 'Load' : 'تحميل'}
                              </span>
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">
                                  {currentLanguage === 'en' ? 'Options' : 'خيارات'}
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                {currentLanguage === 'en' ? 'Profile Options' : 'خيارات الملف الشخصي'}
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => loadProfile(profile.id)}>
                                <Download className="h-4 w-4 mr-2" />
                                {currentLanguage === 'en' ? 'Load Profile' : 'تحميل الملف الشخصي'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  if (confirm(currentLanguage === 'en' 
                                    ? 'Are you sure you want to delete this profile?' 
                                    : 'هل أنت متأكد أنك تريد حذف هذا الملف الشخصي؟')) {
                                    deleteProfile(profile.id)
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {currentLanguage === 'en' ? 'Delete Profile' : 'حذف الملف الشخصي'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 