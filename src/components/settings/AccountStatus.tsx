import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

export function AccountStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statusi i llogarisë</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Badge className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-green-800 dark:text-green-200">Llogari aktive</div>
              <div className="text-sm text-green-600 dark:text-green-300">Ju keni qasje të plotë në të gjitha funkcionalitetet</div>
            </div>
          </div>
          <Badge className="bg-green-500 text-white">
            Premium
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
} 