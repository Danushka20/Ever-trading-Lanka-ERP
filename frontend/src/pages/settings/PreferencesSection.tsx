import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function PreferencesSection() {
  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your application experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">
              Additional preference settings coming soon. Configure language, timezone, currency, and notification preferences.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
