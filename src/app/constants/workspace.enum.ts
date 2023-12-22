import { WorkspaceSkelton } from "shared";

export const WorkspaceEnum: WorkspaceSkelton[] = [
    {
        title: 'Dashboard',
        key: 'dashboard',
        modulePath: 'src/app/modules/dashboard/dashboard.module#DashboardModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'SP Master',
        key: 'spMaster',
        modulePath: 'src/app/modules/sp-master/sp-master.module#SpMasterModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Insurance Reports',
        key: 'commonreport',
        modulePath: 'src/app/modules/common-reports/commonreports.module#commonreportsModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Transaction File Upload',
        key: 'transaction',
        modulePath: 'src/app/modules/transaction-fileupload/transaction-fileupload.module#TransactionFileUploadModule',
        maxCount: 1,
        icon: 'solution'
    },
     {
        title: 'Client Entry',
        key: 'cliententry',
        modulePath: 'src/app/modules/client-entry/client-entry.module#cliententryModule',
        maxCount: 1,
        icon: 'solution'
    },

    {
        title: 'Company Master',
        key: 'CompanyMaster',
        modulePath: 'src/app/modules/CompanyMaster/CompanyMaster.module#CompanyMasterModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Product Master',
        key: 'productMaster',
        modulePath: 'src/app/modules/product-master/product-master.module#ProductMasterModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Inward Entry',
        key: 'inwardentry',
        modulePath: 'src/app/modules/inward-entry/inward-entry.module#InwardEntryModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'SP license expiry report',
        key: 'splicenseexp',
        modulePath: 'src/app/modules/splicense-expiryrpt/splicense-expiryrpt.module#SplicenseExpiryrptModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Master Export',
        key: 'masterexport',
        modulePath: 'src/app/modules/master-export/master-export.module#MasterExportModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Slab Master',
        key: 'slabmaster',
        modulePath: 'src/app/modules/slab-master/slab-master.module#SlabMasterModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Commission Slab',
        key: 'commissionstructure',
        modulePath: 'src/app/modules/commission-structure/commission-structure.module#CommissionStructureModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Reconciliation',
        key: 'reconciliation',
        modulePath: 'src/app/modules/reconciliation/reconciliation.module#ReconciliationModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Insurance Companywise Report',
        key: 'insurcompanywiserpt',
        modulePath: 'src/app/modules/insurance-companywise-rpt/insurance-companywise-rpt.module#InsuranceCompanywiseRptModule',
        maxCount: 1,
        icon: 'solution'
    },

    {
        title: 'Policy To Client Mapping',
        key: 'policyTOclientmapping',
        modulePath: 'src/app/modules/policyTOclientmapping/policyTOclientmapping.module#policyTOclientmappingModule',
        maxCount: 1,
        icon: 'solution'
    },
    
    {
        title: 'Client Location Transfer',
        key: 'Clientlocationtransfer',
        modulePath: 'src/app/modules/clientlocationtransfer/clientlocationtransfer.module#clientlocationtransferModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Reconciliation Report',
        key: 'reconciliationreport',
        modulePath: 'src/app/modules/reconcilationreport/reconcilationreport.module#reconcilationreportModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Commission Reconciliation Report',
        key: 'reconcilationreportcommission',
        modulePath: 'src/app/modules/reconcilationreportcommission/reconcilationreportcommission.module#reconcilationreportcommissionModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Persistency Report',
        key: 'persistencyreport',
        modulePath: 'src/app/modules/persistencyreport/persistencyreport.module#persistencyreportModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Audit Report',
        key: 'auditReport',
        modulePath: 'src/app/modules/audit-report/audit-report.module#AuditReportModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Customer Dashboard',
        key: 'customerdashboard',
        modulePath: 'src/app/modules/customerdashboard/customerdashboard.module#customerdashboardModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Policy Status Report',
        key: 'policyreport',
        modulePath: 'src/app/modules/policyreports/policyreports.module#policyreportsModule',
        maxCount: 1,
        icon: 'solution'
    },     
    {
        title: 'Gst Invoice Generation',
        key: 'GstInvoiceGeneration',
        modulePath: 'src/app/modules/gst-invoice/gst-invoice.module#GstInvoiceModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Commission Recived Report',
        key: 'commissionreport',
        modulePath: 'src/app/modules/commissionreport/commissionreport.module#commissionreportModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Manage Instalments',
        key: 'policywise',
        modulePath: 'src/app/modules/policywise/policywise.module#policywiseModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Franchise Commission',
        key: 'franchieecommission',
        modulePath: 'src/app/modules/franchieecommission/franchieecommission.module#franchieecommissionModule',
        maxCount: 1,
        icon: 'solution'       
    },
    {
        title: 'Franchise Commission Process',
        key: 'franchieeprocess',
        modulePath: 'src/app/modules/franchieeprocess/franchieeprocess.module#franchieeprocessModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Income Reconciliation',
        key: 'commissionreconculiation',
        modulePath: 'src/app/modules/commissionreconculiation/commissionreconculiation.module#commissionreconculiationModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Client Merging',
        key: 'clientmerging',
        modulePath: 'src/app/modules/clientmerging/clientmerging.module#clientmergingModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Policy Mapping Reversal',
        key: 'policyTOclientmapping-reversal',
        modulePath: 'src/app/modules/policyTOclientmapping-reversal/policyTOclientmapping-reversal.module#policyTOclientmappingreversalModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'FTM Report',
        key: 'ftm-report',
        modulePath: 'src/app/modules/Reports/ftm-report/ftm-report.module#FTMReportModule',
        maxCount: 1,
        icon: 'solution'
    },
      {
        title: 'Client Transfer Log Report',
        key: 'clienttransferreport',
        modulePath: 'src/app/modules/Reports/client-transfer-log/client-transfer-log.module#ClientTransferLogModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title:'Ins Company SMS or Mail Alert Config',
        key: 'smsmailconfiguration',
        modulePath: 'src/app/modules/ins-company-smsmail-alert-config/ins-company-smsmail-alert-config.module#InsCompanySMSMailAlertConfigModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title:'Income Report',
        key: 'incomereport',     
        modulePath: 'src/app/modules/Reports/income-report/income-report.module#IncomeReportModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Common File Upload',
        key: 'commonfileupload',
        modulePath: 'src/app/modules/common-file-upload/common-file-upload.module#CommonFileUploadModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Policy Status Mapping',
        key: 'policystatus',
        modulePath: 'src/app/modules/Policystatusmapping/Policystatusmapping.module#PolicystatusmappingModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Exception Report',
        key: 'exceptionreport',
        modulePath: 'src/app/modules/Reports/ExceptionReport/ExceptionReport.module#ExceptionReportModule',
        //modulePath: 'src/app/modules/Policystatusmapping/Policystatusmapping.module#PolicystatusmappingModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Income Reconcilation Report',
        key: 'commisiiondetailsreport',
        modulePath: 'src/app/modules/Reports/commisiondetailsreconcillation/commisiondetailsreconcillation.module#CommisiondetailsreconcillationModule',
        //modulePath: 'src/app/modules/Policystatusmapping/Policystatusmapping.module#PolicystatusmappingModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Complaint Entry',
        key: 'complaintregister',
        modulePath:"src/app/modules/irda-register-module/irda-register-module.module#IRDARegisterModuleModule",
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'IRDA Register ',
        key: 'irdaregister',
        modulePath:"src/app/modules/irda-report/irda-report.module#IRDAReportModule",
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Common File Upload -INS',
        key: 'commonFileUploadIns',
        modulePath:"src/app/modules/irda-sp-file-upload-in-spice-application/irda-sp-file-upload-in-spice-application.module#IRDASPFileUploadInSpiceApplicationModule",
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Client Location Transfer Report',
        key: 'clientLocationTransferReport',
        modulePath:"src/app/modules/client-location-transfer-report/client-location-transfer-report.module#ClientLocationTransferReportModule",
        maxCount: 1,
        icon: 'solution'
    },
    
    

];

