-- Create BizOps Apps table with all required columns
CREATE TABLE IF NOT EXISTS public.bizops_apps (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category text NOT NULL CHECK (category IN ('Application', 'Infrastructure')),
    asset_plan_id integer,
    cmdb_asset_name text,
    uam_plan_asset_name text,
    arl_tier text CHECK (arl_tier IN ('ARL0', 'ARL1', 'ARL2', 'ARL3', 'ARLU', 'NULL')),
    business_group text,
    asset_id text,
    sailpoint_name text,
    request_channel text CHECK (request_channel IN ('Request/', 'Email', 'Sailpoint (CAR/LCM)')),
    revocation_channel text,
    supported_by_am boolean DEFAULT false,
    supported_by_ac boolean DEFAULT false,
    last_modified_date timestamp with time zone,
    last_refresh_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Insert 50 dummy data entries for testing
INSERT INTO public.bizops_apps (
    category, asset_plan_id, cmdb_asset_name, uam_plan_asset_name, arl_tier, 
    business_group, asset_id, sailpoint_name, request_channel, revocation_channel, 
    supported_by_am, supported_by_ac, last_modified_date, last_refresh_date
) VALUES 
('Infrastructure', 64, 'Bitlocker', 'Test', 'ARL2', 'COG Tech', 'AP003874', 'AD_NTADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', false, true, '2024-01-15 10:30:00', '2024-01-20 14:45:00'),
('Application', 101, 'Salesforce CRM', 'SF_CRM_Prod', 'ARL1', 'Sales Operations', 'AP004521', 'SF_ADMIN', 'Request/', 'Email', true, true, '2024-01-18 09:15:00', '2024-01-22 11:20:00'),
('Infrastructure', 87, 'Active Directory', 'AD_Domain_Controller', 'ARL0', 'IT Security', 'AP002156', 'AD_DOMAIN_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', false, true, '2024-01-10 16:45:00', '2024-01-25 08:30:00'),
('Application', 203, 'Microsoft Office 365', 'O365_Enterprise', 'ARL2', 'Productivity', 'AP005789', 'O365_GLOBAL_ADMIN', 'Email', 'Sailpoint - Direct', true, false, '2024-01-12 13:20:00', '2024-01-19 15:10:00'),
('Infrastructure', 156, 'VMware vSphere', 'VMW_vCenter', 'ARL1', 'Infrastructure', 'AP003245', 'VMWARE_ADMIN', 'Request/', 'Email', false, true, '2024-01-14 11:55:00', '2024-01-21 09:40:00'),
('Application', 78, 'Jira Service Desk', 'JIRA_SD_Prod', 'ARL3', 'IT Operations', 'AP006123', 'JIRA_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', true, true, '2024-01-16 14:30:00', '2024-01-23 12:15:00'),
('Infrastructure', 234, 'Cisco ASA Firewall', 'ASA_FW_Primary', 'ARL0', 'Network Security', 'AP001987', 'ASA_ADMIN', 'Request/', 'Email', false, true, '2024-01-11 10:20:00', '2024-01-24 16:50:00'),
('Application', 145, 'Tableau Server', 'TBL_Analytics', 'ARL2', 'Business Intelligence', 'AP007456', 'TABLEAU_ADMIN', 'Email', 'Sailpoint - Direct', true, false, '2024-01-13 15:45:00', '2024-01-20 10:25:00'),
('Infrastructure', 89, 'Windows Server 2019', 'WIN_SRV_2019', 'ARL1', 'Server Operations', 'AP002789', 'WIN_SERVER_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', false, true, '2024-01-17 12:10:00', '2024-01-22 14:35:00'),
('Application', 312, 'ServiceNow ITSM', 'SNOW_ITSM_Prod', 'ARL1', 'IT Service Management', 'AP008234', 'SNOW_ADMIN', 'Request/', 'Email', true, true, '2024-01-15 09:30:00', '2024-01-21 11:45:00'),
('Infrastructure', 67, 'F5 Load Balancer', 'F5_LB_Cluster', 'ARL2', 'Network Infrastructure', 'AP003567', 'F5_ADMIN', 'Email', 'Sailpoint - Direct', false, true, '2024-01-19 13:25:00', '2024-01-25 15:20:00'),
('Application', 198, 'Confluence Wiki', 'CONF_Knowledge_Base', 'ARL3', 'Knowledge Management', 'AP009876', 'CONFLUENCE_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', true, false, '2024-01-12 16:40:00', '2024-01-18 08:55:00'),
('Infrastructure', 123, 'Oracle Database 19c', 'ORA_DB_Prod', 'ARL0', 'Database Administration', 'AP004321', 'ORA_DBA', 'Request/', 'Email', false, true, '2024-01-14 11:15:00', '2024-01-23 13:30:00'),
('Application', 256, 'Slack Enterprise', 'SLACK_Enterprise', 'ARL2', 'Communication', 'AP010543', 'SLACK_ADMIN', 'Email', 'Sailpoint - Direct', true, true, '2024-01-16 14:50:00', '2024-01-24 10:40:00'),
('Infrastructure', 178, 'Splunk Enterprise', 'SPLUNK_SIEM', 'ARL1', 'Security Operations', 'AP005432', 'SPLUNK_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', false, true, '2024-01-18 10:05:00', '2024-01-22 16:25:00'),
('Application', 91, 'Adobe Creative Cloud', 'ADOBE_CC_Enterprise', 'ARL3', 'Creative Services', 'AP011234', 'ADOBE_ADMIN', 'Request/', 'Email', true, false, '2024-01-13 15:20:00', '2024-01-20 12:10:00'),
('Infrastructure', 205, 'Palo Alto Firewall', 'PA_FW_HA_Pair', 'ARL0', 'Perimeter Security', 'AP006789', 'PA_ADMIN', 'Email', 'Sailpoint - Direct', false, true, '2024-01-15 09:45:00', '2024-01-25 14:15:00'),
('Application', 134, 'Zoom Enterprise', 'ZOOM_Enterprise', 'ARL2', 'Video Conferencing', 'AP012567', 'ZOOM_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', true, true, '2024-01-17 13:35:00', '2024-01-21 09:20:00'),
('Infrastructure', 289, 'NetApp Storage', 'NETAPP_FAS_Cluster', 'ARL1', 'Storage Systems', 'AP007890', 'NETAPP_ADMIN', 'Request/', 'Email', false, true, '2024-01-11 12:25:00', '2024-01-24 11:50:00'),
('Application', 167, 'Microsoft Teams', 'TEAMS_Enterprise', 'ARL2', 'Collaboration', 'AP013456', 'TEAMS_ADMIN', 'Email', 'Sailpoint - Direct', true, false, '2024-01-19 16:10:00', '2024-01-23 08:45:00'),
('Infrastructure', 76, 'Citrix XenApp', 'CITRIX_XA_Farm', 'ARL1', 'Virtual Applications', 'AP008765', 'CITRIX_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', false, true, '2024-01-12 14:40:00', '2024-01-22 15:30:00'),
('Application', 223, 'Power BI Premium', 'PBI_Premium_Workspace', 'ARL3', 'Business Analytics', 'AP014789', 'PBI_ADMIN', 'Request/', 'Email', true, true, '2024-01-14 10:55:00', '2024-01-20 13:25:00'),
('Infrastructure', 145, 'IBM WebSphere', 'WAS_App_Server', 'ARL2', 'Application Server', 'AP009654', 'WAS_ADMIN', 'Email', 'Sailpoint - Direct', false, true, '2024-01-16 11:30:00', '2024-01-25 09:15:00'),
('Application', 98, 'GitHub Enterprise', 'GITHUB_Enterprise', 'ARL1', 'Source Control', 'AP015432', 'GITHUB_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', true, false, '2024-01-18 15:45:00', '2024-01-21 12:40:00'),
('Infrastructure', 187, 'Red Hat OpenShift', 'OPENSHIFT_Cluster', 'ARL0', 'Container Platform', 'AP010987', 'OPENSHIFT_ADMIN', 'Request/', 'Email', false, true, '2024-01-13 09:20:00', '2024-01-24 16:05:00'),
('Application', 276, 'Workday HCM', 'WORKDAY_HCM_Prod', 'ARL1', 'Human Resources', 'AP016543', 'WORKDAY_ADMIN', 'Email', 'Sailpoint - Direct', true, true, '2024-01-15 13:15:00', '2024-01-23 10:50:00'),
('Infrastructure', 112, 'Checkpoint Firewall', 'CP_FW_Cluster', 'ARL2', 'Network Security', 'AP011876', 'CP_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', false, true, '2024-01-17 14:25:00', '2024-01-22 08:35:00'),
('Application', 159, 'Atlassian Bitbucket', 'BITBUCKET_Enterprise', 'ARL3', 'Code Repository', 'AP017654', 'BITBUCKET_ADMIN', 'Request/', 'Email', true, false, '2024-01-11 16:35:00', '2024-01-25 12:20:00'),
('Infrastructure', 234, 'Microsoft SQL Server', 'MSSQL_AlwaysOn', 'ARL1', 'Database Platform', 'AP012345', 'MSSQL_DBA', 'Email', 'Sailpoint - Direct', false, true, '2024-01-19 10:40:00', '2024-01-20 14:55:00'),
('Application', 87, 'Okta Identity', 'OKTA_SSO_Prod', 'ARL0', 'Identity Management', 'AP018765', 'OKTA_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', true, true, '2024-01-12 12:50:00', '2024-01-24 09:30:00'),
('Infrastructure', 198, 'AWS EC2', 'AWS_EC2_Production', 'ARL2', 'Cloud Infrastructure', 'AP013579', 'AWS_ADMIN', 'Request/', 'Email', false, true, '2024-01-14 15:10:00', '2024-01-21 11:25:00'),
('Application', 145, 'DocuSign eSignature', 'DOCUSIGN_Enterprise', 'ARL3', 'Document Management', 'AP019876', 'DOCUSIGN_ADMIN', 'Email', 'Sailpoint - Direct', true, false, '2024-01-16 09:55:00', '2024-01-23 15:40:00'),
('Infrastructure', 267, 'Kubernetes Cluster', 'K8S_Prod_Cluster', 'ARL1', 'Container Orchestration', 'AP014680', 'K8S_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', false, true, '2024-01-18 13:45:00', '2024-01-22 10:15:00'),
('Application', 123, 'Zendesk Support', 'ZENDESK_Support_Prod', 'ARL2', 'Customer Support', 'AP020987', 'ZENDESK_ADMIN', 'Request/', 'Email', true, true, '2024-01-13 11:20:00', '2024-01-25 13:50:00'),
('Infrastructure', 89, 'Fortinet FortiGate', 'FORTINET_FG_Cluster', 'ARL0', 'Next-Gen Firewall', 'AP015791', 'FORTINET_ADMIN', 'Email', 'Sailpoint - Direct', false, true, '2024-01-15 14:30:00', '2024-01-20 16:45:00'),
('Application', 201, 'Dropbox Business', 'DROPBOX_Business_Advanced', 'ARL3', 'File Sharing', 'AP021098', 'DROPBOX_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', true, false, '2024-01-17 10:25:00', '2024-01-24 12:35:00'),
('Infrastructure', 156, 'Ansible Tower', 'ANSIBLE_Tower_Cluster', 'ARL1', 'Automation Platform', 'AP016802', 'ANSIBLE_ADMIN', 'Request/', 'Email', false, true, '2024-01-11 15:40:00', '2024-01-21 09:55:00'),
('Application', 178, 'HubSpot CRM', 'HUBSPOT_CRM_Enterprise', 'ARL2', 'Marketing Automation', 'AP022109', 'HUBSPOT_ADMIN', 'Email', 'Sailpoint - Direct', true, true, '2024-01-19 12:15:00', '2024-01-23 14:20:00'),
('Infrastructure', 234, 'Terraform Enterprise', 'TF_Enterprise_Cluster', 'ARL1', 'Infrastructure as Code', 'AP017913', 'TF_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', false, true, '2024-01-12 16:50:00', '2024-01-25 11:10:00'),
('Application', 92, 'Miro Collaboration', 'MIRO_Enterprise', 'ARL3', 'Visual Collaboration', 'AP023210', 'MIRO_ADMIN', 'Request/', 'Email', true, false, '2024-01-14 08:35:00', '2024-01-22 15:25:00'),
('Infrastructure', 167, 'Elastic Stack', 'ELK_Stack_Cluster', 'ARL2', 'Log Analytics', 'AP018024', 'ELASTIC_ADMIN', 'Email', 'Sailpoint - Direct', false, true, '2024-01-16 13:20:00', '2024-01-20 10:40:00'),
('Application', 145, 'Notion Workspace', 'NOTION_Enterprise', 'ARL3', 'Knowledge Base', 'AP024321', 'NOTION_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', true, true, '2024-01-18 11:45:00', '2024-01-24 16:30:00'),
('Infrastructure', 289, 'HashiCorp Vault', 'VAULT_HA_Cluster', 'ARL0', 'Secrets Management', 'AP019135', 'VAULT_ADMIN', 'Request/', 'Email', false, true, '2024-01-13 14:55:00', '2024-01-21 08:20:00'),
('Application', 123, 'Figma Organization', 'FIGMA_Org_Enterprise', 'ARL2', 'Design Collaboration', 'AP025432', 'FIGMA_ADMIN', 'Email', 'Sailpoint - Direct', true, false, '2024-01-15 09:10:00', '2024-01-23 12:45:00'),
('Infrastructure', 198, 'Prometheus Monitoring', 'PROMETHEUS_HA_Setup', 'ARL1', 'Monitoring Platform', 'AP020246', 'PROMETHEUS_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', false, true, '2024-01-17 15:25:00', '2024-01-22 13:15:00'),
('Application', 167, 'Asana Project Management', 'ASANA_Enterprise', 'ARL3', 'Project Management', 'AP026543', 'ASANA_ADMIN', 'Request/', 'Email', true, true, '2024-01-11 12:40:00', '2024-01-25 14:50:00'),
('Infrastructure', 234, 'GitLab Enterprise', 'GITLAB_Enterprise_Edition', 'ARL1', 'DevOps Platform', 'AP021357', 'GITLAB_ADMIN', 'Email', 'Sailpoint - Direct', false, true, '2024-01-19 16:20:00', '2024-01-20 11:35:00'),
('Application', 89, 'Monday.com Work OS', 'MONDAY_Enterprise', 'ARL2', 'Work Management', 'AP027654', 'MONDAY_ADMIN', 'Sailpoint (CAR/LCM)', 'Sailpoint - Direct', true, false, '2024-01-12 10:30:00', '2024-01-24 15:10:00'),
('Infrastructure', 156, 'Grafana Enterprise', 'GRAFANA_Enterprise_Stack', 'ARL1', 'Observability Platform', 'AP022468', 'GRAFANA_ADMIN', 'Request/', 'Email', false, true, '2024-01-14 13:50:00', '2024-01-21 16:25:00'),
('Application', 201, 'Canva for Teams', 'CANVA_Teams_Enterprise', 'ARL3', 'Graphic Design', 'AP028765', 'CANVA_ADMIN', 'Email', 'Sailpoint - Direct', true, true, '2024-01-16 11:05:00', '2024-01-23 09:40:00');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bizops_apps_category ON public.bizops_apps(category);
CREATE INDEX IF NOT EXISTS idx_bizops_apps_arl_tier ON public.bizops_apps(arl_tier);
CREATE INDEX IF NOT EXISTS idx_bizops_apps_business_group ON public.bizops_apps(business_group);
CREATE INDEX IF NOT EXISTS idx_bizops_apps_supported_by_am ON public.bizops_apps(supported_by_am);
CREATE INDEX IF NOT EXISTS idx_bizops_apps_supported_by_ac ON public.bizops_apps(supported_by_ac);
