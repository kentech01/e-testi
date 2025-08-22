import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Download, Shield, Bell } from 'lucide-react';

export function PrivacySecurity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Siguria dhe privatësia</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start h-auto p-4">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">Shkarko të dhënat</div>
                <div className="text-xs text-muted-foreground">Eksporto të gjitha të dhënat tuaja</div>
              </div>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start h-auto p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">Ndrysho fjalëkalimin</div>
                <div className="text-xs text-muted-foreground">Përditëso fjalëkalimin tuaj</div>
              </div>
            </div>
          </Button>
        </div>
        
        <Button variant="outline" className="w-full justify-start h-auto p-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">Historia e veprimtarive</div>
              <div className="text-xs text-muted-foreground">Shiko hyrjet dhe veprimet e kohëve të fundit</div>
            </div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
} 